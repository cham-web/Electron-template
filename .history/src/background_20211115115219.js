'use strict'

import { app, protocol, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const path = require('path')
const updateHandle = require('./utils/mainProcess') // 引入更新程序
const hotKeyFun = require('./utils/hotKey')
const expressWs = require('./utils/expressSocket') // 运行socket
const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let tray = null // 系统托盘变量Tray
async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1250,
    height: 703,
    minWidth: 1250, // 设置最小宽度
    minHeight: 703, // 设置最小高度，mac打包必备
    resizable: true,
    hasShadow: true,
    acceptFirstMouse: true,
    backgroundColor: '#F6F7F9',
    frame: false,
    show: false,
    webPreferences: {
      // Required for Spectron testing
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true // process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.on('ready-to-show', () => {
    win.show()
  })
  // 隐藏 顶部 菜单
  // win.setMenu(null)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  // 触发更新
  updateHandle(win)

  // 设置快捷键
  hotKeyFun(win)

  // 创建socket
  expressWs()
  const exeLink = path.resolve(__dirname, '../bin/', 'TestHaiKang.exe')
  shell.openExternal(exeLink) // 打开上位机
  // ipcMain.on('setHotKey', (event, key) => {
  //   globalShortcut.register(key, () => {
  //     console.log(key)
  //   })
  // })

  win.setAspectRatio(1.777777777777778) // 设置窗口等比例缩放
  ipcMain.on('exit', (event, args) => {
    if (args) {
      app.exit()
    }
  })
  globalShortcut.register('CommandOrControl+P', () => {
    console.log(123)
    const isDevTool = win.webContents.isDevToolsOpened()
    isDevTool ? win.webContents.closeDevTools() : win.webContents.openDevTools()
  })
  // 创建系统通知区菜单
  isDevelopment ? tray = new Tray(path.join(__dirname, '../public/icon.ico')) : tray = new Tray(path.join(__dirname, 'icon.ico')) // 判断是否是开发环境
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '检查更新',
      click: () => {
        win.show()
        win.webContents.send('update')
      }
    },
    {
      label: '退出应用',
      click: () => {
        win.destroy()
      }
    }
  ])
  tray.setToolTip(process.env.VUE_APP_APPID)
  tray.setContextMenu(contextMenu)
  tray.on('click', () => { // 我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    win.show()
    win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true)
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  // 注销所有快捷键
  globalShortcut.unregisterAll()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  app.allowRendererProcessReuse = false
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
