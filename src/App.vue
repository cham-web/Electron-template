<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
const { ipcRenderer } = window.require('electron')
export default {
  created () {
    ipcRenderer.on('update', (event, data) => {
      this.autoUpdate()
    })
  },
  mounted () {
    if (process.env.NODE_ENV === 'production') {
      ipcRenderer.on('message', (event, data) => {
        console.log('message', data.msg)
      })
      ipcRenderer.on('downloadProgress', (event, progressObj) => {
        console.log('downloadProgress', progressObj)
        // 可自定义下载渲染效果
      })
      ipcRenderer.on('isUpdateNow', (event, versionInfo) => {
        // 自定义选择效果，效果自行编写
        this.$confirm('检测到新版本' + versionInfo.version + ',是否立即升级？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          ipcRenderer.send('updateNow')
        })
      })
      this.autoUpdate() // electron应用启动后主动触发检查更新函数
    }
  },
  methods: {
    autoUpdate () { // 用来触发更新函数
      ipcRenderer.send('checkForUpdate')
    }
  }
}
</script>

<style lang="less">

#app {
  font-family:pingfang, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 16px;
  box-sizing: border-box;
}

</style>
