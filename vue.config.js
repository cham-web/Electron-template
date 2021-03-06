module.exports = {
  css: {
    loaderOptions: {
      less: {
        additionalData: '@import "./src/assets/css/common.less";'
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['serialport'],
      builderOptions: {
        npmRebuild: true, // 在打包之前不再进行创建node_modules
        buildDependenciesFromSource: true, // 使用当前开发环境的node_modules
        appId: `com.${process.env.VUE_APP_APPID}.app`,
        productName: process.env.VUE_APP_APPID, // 项目名，也是生成的安装文件名
        copyright: 'Copyright © 2021', // 版权信息
        directories: {
          output: './dist_electron' // 输出文件路径
        },
        publish: [
          {
            provider: 'generic',
            url: process.env.VUE_APP_UPLOAD_URL
          }
        ],
        extraResources: [
          {
            from: './bin',
            to: 'bin'
          },
          {
            from: './ffmpeg',
            to: 'ffmpeg'
          }
        ],
        win: { // win相关配置
          icon: './public/icon.ico', // 图标，当前图标在根目录下，注意这里有两个坑
          target: [
            {
              target: 'nsis', // 利用nsis制作安装程序
              arch: [
                'x64' // 64位
                // 'ia32' // 32位
              ]
            }
          ]
        },
        mac: {
          icon: './public/icon.icns'
        },
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          installerIcon: './public/icon.ico', // 安装图标
          uninstallerIcon: './public/icon.ico', // 卸载图标
          installerHeaderIcon: './public/icon.ico', // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: process.env.VUE_APP_APPID // 图标名称
        }
      }
    }
  }
}
