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

function onWebAuthResult(onAccquired) {
  return (redirectUrl) => {
    let result = new TokenResult(redirectUrl)
    if (!result.passesCsrf(config.csrfState)) {
      return
    }
    getToken(result.getCode(), onAccquired)
  }
}

function getToken(code, onAccquired) {
  l('getToken')
  $.ajax({
    type: "POST",
    url: config.accessTokenUrl,
    data: config.accessTokenData(code),
    success: (resultData) => {
      let token = resultData.access_token
      storage.saveTokenToLocalStorage(token)
      uiState.loggedIn()
      onAccquired(token)
    },
    error: () => {
      l("Token acquisition failed.")
    }
  })
}

function launchWebAuthFlow(onAccquired, interactive) {
  chrome
    .identity
    .launchWebAuthFlow(
      config.authorizeUrl(interactive),
      onWebAuthResult(onAccquired)
    )
}

function getUserToken(onAccquired) {
  l('getUserToken')

  if(chrome.extension.inIncognitoContext){
    uiState.icognito()
    return
  }

  let tokenFromStorage = storage.getTokenFromLocalStorage()
  if (tokenFromStorage != null) {
    uiState.loggedIn()
    return onAccquired(tokenFromStorage)
  }

  try {
    launchWebAuthFlow(onAccquired, false)
  } catch (e) {
    uiState.loginRequired(() => {
      launchWebAuthFlow(onAccquired, true)
    })
  }

}

module.exports = {
  getUserToken: getUserToken
}
