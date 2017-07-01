function log(obj) {
  if (!('update_url' in chrome.runtime.getManifest())) {
    console.log(JSON.stringify(obj))
  }
}

module.exports = log
