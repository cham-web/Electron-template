const { ipcMain } = require('electron') // ipcMain 主线程
const { autoUpdater } = require('electron-updater')
const uploadUrl = process.env.VUE_APP_UPLOAD_URL // 安装包helatest.yml所在服务器地址
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle (min) {
  const message = {
    error: { status: -1, msg: '检测更新查询异常' },
    checking: { status: 0, msg: '正在检查更新...' },
    updateAva: { status: 1, msg: '检测到新版本,正在下载,请稍后' },
    updateNotAva: { status: 2, msg: '您现在使用的版本为最新版本,无需更新!' }
  }
  let versionInfo = ''
  autoUpdater.setFeedURL(uploadUrl)
  // 检测更新查询异常
  autoUpdater.on('error', () => {
    sendUpdateMessage(min, message.error)
  })
  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(min, message.checking)
  })
  // 当发现有可用更新的时候触发，更新包下载会自动开始
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(min, message.updateAva)
  })
  // 当发现版本为最新版本触发
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(min, message.updateNotAva)
  })
  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    min.webContents.send('downloadProgress', progressObj)
  })
  // 包下载成功时触发
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    // 收到renderer进程确认更新
    ipcMain.on('updateNow', (e, arg) => {
      console.log('开始更新')
      autoUpdater.quitAndInstall() // 包下载完成后，重启当前的应用并且安装更新
    })
    // 主进程向renderer进程发送是否确认更新
    min.webContents.send('isUpdateNow', versionInfo)
  })

  ipcMain.on('checkForUpdate', () => {
    // 收到renderer进程的检查通知后，执行自动更新检查
    // autoUpdater.checkForUpdates()
    const checkInfo = autoUpdater.checkForUpdates()
    checkInfo.then(function (data) {
      versionInfo = data.versionInfo // 获取更新包版本等信息
    })
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage (min, text) {
  min.webContents.send('message', text)
}

module.exports = updateHandle
