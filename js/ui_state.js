let ui = require('./ui')
let l = require('./logger')

function loggedIn() {
  l("State: loggedIn")
  ui.getTaksContainer().show()
  ui.getLoginBtn().hide()
}

function loginRequired(listener) {
  l("State: loginRequired")
  ui.getTaksContainer().hide()
  ui.getLoginBtn().show()
  ui.setLoginClickListener(() => {
    listener()
  })
}

function icognito() {
  l("State: icognito")
  let icognito= ui.getIcognito()
  icognito.removeClass("hidden")
  ui.getTaksContainer().hide()
  ui.getLoginBtn().hide()
}

module.exports = {
  loggedIn: loggedIn,
  icognito: icognito,
  loginRequired: loginRequired
}
