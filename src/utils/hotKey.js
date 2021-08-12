const { ipcMain, globalShortcut } = require('electron') // ipcMain 主线程

function hotKeyFun (win) {
  console.log(ipcMain)
  ipcMain.on('setHotkey', (event, key) => {
    globalShortcut.register(key, () => {
      console.log(key)
    })
  })
}

module.exports = hotKeyFun
