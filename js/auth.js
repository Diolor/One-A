let storage = require('./storage')
let config = require('./config')
let uiState = require('./ui_state')
let l = require('./logger')
let $ = require('jquery')


class TokenResult {
  constructor(redirectUrl) {
    this.url = new URL(redirectUrl)
  }

  passesCsrf(csrfState) {
    return this.getState() == csrfState
  }

  getState() {
    return this.url.searchParams.get("state")
  }

  getCode() {
    return this.url.searchParams.get("code")
  }
}


function getToken(code) {
  l('getToken')
  return new Promise((resolve, reject) => {
    $.ajax({
        type: "POST",
        url: config.accessTokenUrl,
        data: config.accessTokenData(code),
      })
      .done((resultData) => {
        let token = resultData.access_token
        storage.saveTokenToLocalStorage(token)
        uiState.loggedIn()
        resolve(token)
      })
      .fail(() => {
        l("Token acquisition failed.")
      })
  })
}

function onWebAuthResult(onAccquired) {
  return (redirectUrl) => {
    console.log(redirectUrl)
    let result = new TokenResult(redirectUrl)
    if (!result.passesCsrf(config.csrfState)) {
      return
    }
    getToken(result.getCode())
      .then(token => onAccquired(token))
  }
}

function launchWebAuthFlow(onAccquired, interactive) {
  return new Promise((resolve, reject) => {
      chrome
        .identity
        .launchWebAuthFlow(
          config.authorizeUrl(interactive),
          (redirectUrl) => {
            if (chrome.runtime.lastError || redirectUrl == null) {
              reject(new Error("No redirect url"))
              return
            }
            resolve(redirectUrl)
          }
        )
    })
    .then(code => extractResponseCode(code, onAccquired))
}

function extractResponseCode(redirectUrl, onAccquired) {
  l("extractResponseCode")

  let result = new TokenResult(redirectUrl)
  if (!result.passesCsrf(config.csrfState)) {
    return
  }
  getToken(result.getCode())
    .then(token => onAccquired(token))
}

function setLoginState(onAccquired) {
  l("setLoginState")
  uiState.loginRequired(() => {
    launchWebAuthFlow(onAccquired, true)
      .catch(reason => l("Failed to launch login."))
  })
}

function getUserToken(onAccquired) {
  l('getUserToken')

  if (chrome.extension.inIncognitoContext) {
    uiState.icognito()
    return
  }

  let tokenFromStorage = storage.getTokenFromLocalStorage()
  if (tokenFromStorage != null) {
    uiState.loggedIn()
    return onAccquired(tokenFromStorage)
  }

  launchWebAuthFlow(onAccquired, false)
    .catch(reason => setLoginState(onAccquired))
}

module.exports = {
  getUserToken: getUserToken
}
