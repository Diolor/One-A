let imageKey = "image"
let listKey = "list"
let accessTokenKey = "accessToken"

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  return localStorage.getItem(key);
}

function saveTokenToLocalStorage(token) {
  saveToLocalStorage(accessTokenKey, token);
}

function getTokenFromLocalStorage() {
  return getFromLocalStorage(accessTokenKey);
}

function saveImageToLocalStorage(base64Image) {
  saveToLocalStorage(imageKey, base64Image);
}

function getImageFromLocalStorage() {
  return getFromLocalStorage(imageKey);
}

function saveSelectedListToLocalStorage(list) {
  var json = JSON.stringify(list);
  saveToLocalStorage(listKey, json);
}

function getSelectedListFromLocalStorage() {
  try {

    var json = getFromLocalStorage(listKey);
    return JSON.parse(json);
  } catch (e) {
    return undenfined;
  }
}

module.exports = {
  saveTokenToLocalStorage: saveTokenToLocalStorage,
  getTokenFromLocalStorage: getTokenFromLocalStorage,
  saveImageToLocalStorage: saveImageToLocalStorage,
  getImageFromLocalStorage: getImageFromLocalStorage,
  saveSelectedListToLocalStorage: saveSelectedListToLocalStorage,
  getSelectedListFromLocalStorage: getSelectedListFromLocalStorage
}
