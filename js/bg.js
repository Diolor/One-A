'use strict';

var l = require('./logger');
var ui = require('./ui');
var storage = require('./storage')
let config = require('./config')
let $ = require('jquery')

let collections = [
  '791207', // aerial
  // '573009', // Micro Worlds
  // '138584', // water
  // '361687' // architecture
]

let source = 'https://source.unsplash.com/collection/' +
  collections[Math.floor(Math.random() * collections.length)] + '/'


function drawImage(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

  return canvas
}

function setPhoto() {
  // document
  //   .getElementsByClassName("photos-container")[0]
  //   .style
  //   .backgroundImage = 'url(data:image/jpeg;charset=utf-8;base64,' + storage.getImageFromLocalStorage() + ')';

  ui.setBackgroundImage(
    'url(data:image/jpeg;charset=utf-8;base64,' + storage.getImageFromLocalStorage() + ')',
    storage.getImageHtmlUrlFromLocalStorage()
  )
}

function PhotoLoader(collectionId) {
  var self = this;

  this.init = () => {
    setPhoto()
    self.loadNextPhoto()
  }

  this.loadNextPhoto = () => {
    // $.getJSON(source, data => {
    // let imgUrl = data.urls.regular
    let imgUrl = source
    let img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {

      var canvas = drawImage(img)
      var dataURL = canvas.toDataURL("image/png");

      var base64Image = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      var noLocalImageStored = storage.getImageFromLocalStorage() == undefined
      storage.saveImageToLocalStorage(
        base64Image,
        imgUrl //  data.links.html
      );
      l("Photo updated")

      if (noLocalImageStored) {
        self.init()
      }
    };

    img.src = imgUrl
    // })
  }
}

module.exports = PhotoLoader
