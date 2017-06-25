global.jQuery = require('jquery')
let $ = require('jquery')
require('bootstrap')

var ENTER_KEY = 13;

function getTaskInputDiv() {
  return $('.next-task-input')
}

function getOneTaskDiv() {
  return $('#one-task')
}

function getSelectedListDiv() {
  return $("#selected-list")
}

function getIcognito() {
  return $("#icognito")
}

function getLoginBtn() {
  return $("#login")
}

function getTaksContainer() {
  return $("#tasksContainer")
}

function setBackgroundImage(imageurl) {
  $("#photos-container").css("background-image", imageurl)
}

function setLists(lists, onListSelected) {
  var ul = $("#lists-tasks")
  ul.empty()
  var i, title;
  for (i in lists) {
    addItemToList(ul, lists[i], onListSelected)
  }
}

function addItemToList(ul, list, onListSelected) {
  var item = $('<li><a href="#">' + list.title + ' </a></li>');
  $(item).click(() => {
    onListSelected(list);
  });

  item.appendTo(ul)
}

function setSelectedListName(name) {
  var selectedListDiv = getSelectedListDiv()
  selectedListDiv.html(name)
  selectedListDiv.show()
}

function setTaskName(taskTitle) {
  let taskDiv = getOneTaskDiv()
  let newOne = clone(taskDiv)
  newOne.html(taskTitle)
  newOne.show()
  newOne.addClass("fadeIn")
  newOne.removeClass("hidden")
  return newOne
}

function clone(oldDiv) {
  let newone = oldDiv.clone()
  oldDiv.before(newone)
  oldDiv.remove()

  return newone
}

function cleanTaskName(taskDiv) {
  taskDiv.html("")
}

function showTaskInput() {
  let taskInput = getTaskInputDiv()
  let newOne = clone(taskInput)
  newOne.html("")
  newOne.show()
  newOne.addClass("fadeIn")
  newOne.removeClass("hidden")
  return newOne
}

function disableNewLineOnEnterPress(nextTaskDiv) {
  $(nextTaskDiv).unbind("keypress")
  $(nextTaskDiv).keypress((event) => {
    if (event.which == ENTER_KEY) {
      event.preventDefault();
    }
  });
}

function setOnEnterSaveListener(nextTaskDiv, listener) {
  $(nextTaskDiv[0]).unbind("keyup")
  $(nextTaskDiv[0]).keyup((event) => {
    event.preventDefault();
    if (event.which == ENTER_KEY) {
      listener();
    }
  });
}

function setTaskClickListener(oneTaskDiv, task) {
  $(oneTaskDiv).unbind("click")
  $(oneTaskDiv).click(() => {
    task()
  });
}

function setLoginClickListener(listener) {
  getLoginBtn().click(() => {
    listener()
  })
}

module.exports = {
  getTaskInputDiv: getTaskInputDiv,
  getNextTaskDiv: getTaskInputDiv,
  getOneTaskDiv: getOneTaskDiv,
  getIcognito: getIcognito,
  getLoginBtn: getLoginBtn,
  getTaksContainer: getTaksContainer,
  setTaskName: setTaskName,
  showTaskInput: showTaskInput,
  cleanTaskName: cleanTaskName,
  disableNewLineOnEnterPress: disableNewLineOnEnterPress,
  setOnEnterSaveListener: setOnEnterSaveListener,
  setTaskClickListener: setTaskClickListener,
  setLoginClickListener: setLoginClickListener,
  setSelectedListName: setSelectedListName,
  setLists: setLists,
  setBackgroundImage: setBackgroundImage
}
