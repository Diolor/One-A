'use strict';

var l = require('./logger');
var ui = require('./ui');
var storage = require('./storage')
let auth = require('./auth')

var WunderlistSDK = require('./dist/wunderlist.sdk.min');

function WunderlistAPI(accessToken) {
  return new WunderlistSDK({
    'accessToken': accessToken,
    'clientID': '12c6f68241841ab27215'
  });
}

function TaskObserver(listId) {
  var self = this;

  this.init = function() {
    auth.getUserToken((accessToken) => {
      self.WunderlistAPI = WunderlistAPI(accessToken)
      self.WunderlistAPI.initialized
        .done(self.loadLists)
    })
  }

  this.loadLists = function() {
    l("loadLists")
    self.WunderlistAPI.http.lists
      .all()
      .done(self.handleListsLoading)
      .fail(handleError);
  }

  this.handleListsLoading = function(lists) {
    l("handleListsLoading")
    ui.setLists(lists, function(selectedList) {
      self.selectList(selectedList)
    })

    var list = storage.getSelectedListFromLocalStorage();
    if (list == undefined) {
      list = findInbox(lists)
    }
    self.selectList(list);
  }

  this.selectList = function(list) {
    l("selectList")
    self.listId = list.id
    storage.saveSelectedListToLocalStorage(list)
    self.loadListData()
    ui.setSelectedListName(list.title)
  }

  this.loadListData = function() {
    l("loadListData")
    self.WunderlistAPI.http.tasks
      .forList(this.listId)
      .done(self.handleListData)
      .fail(handleError);
  }

  this.handleListData = function(x) {
    l("handleListData");

    var task = x[0];

    if (task == undefined) {
      self.enableNextTaskInput();
    } else {
      self.updateTask(task);
    }
  }

  this.handleSaveTask = function() {
    l("task added");
    self.loadListData();
  }

  this.handleCompleteTask = function() {
    l("task marked as completed");
    self.loadListData()
  }

  this.saveTask = function(title) {
    l("saveTask")
    var listId = this.listId
    self.WunderlistAPI.http.tasks
      .create({
        'list_id': listId,
        'title': title
      })
      .done(self.handleSaveTask)
      .fail(handleSaveTaskError);
  }

  this.completeTask = function(taskId, revision) {
    l("completeTask")
    self.WunderlistAPI.http.tasks
      .update(taskId, revision, {
        'completed': true
      })
      .done(self.handleCompleteTask)
      .fail(self.handleCompleteTaskError)
  }

  this.enableNextTaskInput = function() {
    l("enableTaskInput")

    let oneTaskDiv = ui.getOneTaskDiv()
    ui.cleanTaskName(oneTaskDiv)

    let nextTaskDiv = ui.showTaskInput()
    ui.disableNewLineOnEnterPress(nextTaskDiv);

    var clickedEnter = false;
    ui.setOnEnterSaveListener(nextTaskDiv, function() {
      if (clickedEnter) {
        return
      }
      clickedEnter = true;
      self.saveTask(nextTaskDiv.html());
    });

    nextTaskDiv.focus();
  }

  this.updateTask = function(task) {
    l("updateTask")

    ui.getTaskInputDiv().hide()
    let oneTaskDiv = ui.setTaskName(task.title);

    let clickedCompletion = false;
    ui.setTaskClickListener(oneTaskDiv, () => {
      if (clickedCompletion) {
        return
      }
      clickedCompletion = true;
      self.completeTask(task.id, task.revision);
    });
  }

  this.handleCompleteTaskError = function() {
    l("task marking as completed failed");
    self.loadLists()
  }

}

function findInbox(lists) {
  for (var i in lists) {
    var list = lists[i]
    if (list.list_type == 'inbox') {
      return list
    }
  }
}

function handleSaveTaskError(e) {
  l("task addition failed");
}

function handleError() {
  l("generic error")
}

module.exports = TaskObserver
