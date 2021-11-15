<template>
  <div class="">
    <!-- <el-button id="play" @click="play">播放</el-button>
    <el-button id="destroy" @click="destroy">销毁</el-button>
    <el-button @click="photo">拍照</el-button> -->
    <div class="video-com" v-show="playShow">
      <div class="video-box" :ref="`video-box-${index}`" v-for="(item, index) in rtspArr" :key="index">
        <video  class="video"  :ref="`video-${index}`" @loadeddata="loadeddata"></video>
        <div class="control">
          <li @click="photo(item, index)">拍照</li>
          <li @click="screen(index)">{{isFullScreen?'缩小':'全屏'}}</li>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

import Vue from 'vue'
import message from '@/utils/Message_pb'
import CySocket from '../utils/CySocket'
import flvjs from 'flv.js'
import { Loading } from 'element-ui'
const { ipcRenderer } = window.require('electron')
export default {
  name: 'Home',
  components: {
  },
  props: {
    arr: {
      type: Array,
      default: () => [{ url: 'admin:H.123456@192.168.1.65', downTime: null },
        { url: 'admin:rsd206369@192.168.1.64', downTime: null }]
    }
  },
  data () {
    return {
      rtspArr: [],
      isFullScreen: false,
      loading: null,
      playShow: false,
      flvPlayerList: []
    }
  },
  created () {
    this.rtspArr = this.arr
    var that = this
    if (!this.CySocket) {
      Vue.prototype.CySocket = new CySocket({
        server: process.env.VUE_APP_WS_URL,
        autoReconnect: true,
        openSocket () {
          const user = new message.FirstAidCmd()
          console.log(user)
          that.rtspArr.forEach(item => {
            user.setMsgtype(1)
            user.setSecretkey(item.url)
            // user.setUsercode(that.$store && that.$store.getters && that.$store.getters.roles.loginNo)
            this.sendMsg(user.serializeBinary())
          })
        }
      })
      this.CySocket.init()
    }
    this.CySocket.socket.onmessage = (res) => {
      console.log(res)
      clearTimeout(this.time)
      const data = this.CySocket.backMsg(res)
      console.log(data, '602--------------')
      console.log(data.getSecretkey())
      if (data.getMsgtype() === 2) {
        console.log(data.getSecretkey)
        if (data.getSecretkey() !== '无车牌') {
          this.$emit('back', data.getSecretkey())
        }
      }
    }
    this.$nextTick(() => {
      this.play()
    })
  },
  destroyed () {
    this.destroy()
  },
  methods: {
    screen (index) {
      if (!this.isFullScreen) {
        this.FullScreen(this.$refs[`video-box-${index}`][0])
      } else {
        this.exitFullscreen(document)
      }
    },
    FullScreen (ele) {
      this.isFullScreen = true
      if (ele.requestFullscreen) {
        ele.requestFullscreen()
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen()
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen()
      }
    },
    exitFullscreen (de) {
      this.isFullScreen = false
      if (de.exitFullscreen) {
        de.exitFullscreen()
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen()
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen()
      }
    },
    loadeddata (e) {
      console.log(e)
      if (this.loading) {
        this.loading.close()
        this.loading = null
        console.log(this.loading)
      }
    },
    photo (item, index) {
      const user = new message.FirstAidCmd()
      console.log(user)
      user.setMsgtype(3)
      user.setSecretkey(item.url)
      this.CySocket.sendMsg(user.serializeBinary())
    },

    createVideo (item, url, ele, index) {
      if (flvjs.isSupported()) {
        // var videoElement = document.getElementById('videoElement' + this.count)
        this.flvPlayer = flvjs.createPlayer(
          {
            type: 'flv',
            isLive: true,
            hasAudio: false,
            url: `ws://127.0.0.1:16001/rtsp/${index}/?url=rtsp://${url}/Streaming/Channels/101`
          },
          {
            enableWorker: false, // 不启用分离线程
            enableStashBuffer: false, // 关闭IO隐藏缓冲区
            reuseRedirectedURL: true, // 重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            autoCleanupSourceBuffer: true // 自动清除缓存
          }
        )

        this.flvPlayer.attachMediaElement(ele)
        // this.flvPlayer.load();

        if (url !== '' && url !== null) {
          this.flvPlayer.load()
          this.flvPlayer.play()
        }
      }

      // 定时方法是为了用户离开页面视频是实时播放的,暂停按钮无用
      item.downTime = setInterval(function () {
        // console.log(ele.buffered,"idididid");
        if (ele.buffered.length > 0) {
          const end = ele.buffered.end(0) // 视频结尾时间
          const current = ele.currentTime //  视频当前时间
          const diff = end - current // 相差时间
          // console.log(diff);
          const diffCritical = 4 // 这里设定了超过4秒以上就进行跳转
          const diffSpeedUp = 1 // 这里设置了超过1秒以上则进行视频加速播放
          const maxPlaybackRate = 4 // 自定义设置允许的最大播放速度
          let playbackRate = 1.0 // 播放速度
          if (diff > diffCritical) {
            //  this.flvPlayer.load();
            // console.log("相差超过4秒，进行跳转");
            ele.currentTime = end - 1.5
            playbackRate = Math.max(1, Math.min(diffCritical, 16))
          } else if (diff > diffSpeedUp) {
            // console.log("相差超过1秒，进行加速");
            playbackRate = Math.max(1, Math.min(diff, maxPlaybackRate, 16))
          }
          ele.playbackRate = playbackRate
          if (ele.paused) {
            ele.play()
          }
        }
        //  if (videoElement.buffered.length) {
        //   let end = this.flvPlayer.buffered.end(0);//获取当前buffered值
        //   let diff = end - this.flvPlayer.currentTime;//获取buffered与currentTime的差值
        //   if (diff >= 0.5) {//如果差值大于等于0.5 手动跳帧 这里可根据自身需求来定
        //     this.flvPlayer.currentTime = this.flvPlayer.buffered.end(0);//手动跳帧
        //  }
        // }
      }, 1000)

      this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
        // alert("网络波动,正在尝试连接中...");
        console.log('网络波动,正在尝试连接中...')
        if (this.flvPlayer) {
          this.reloadVideo(this.flvPlayer)
        }
        // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
        // errType是 MediaError时，对应errDetail是MediaMSEError   或MEDIA_SOURCE_ENDED
      })
      this.flvPlayerList.push(this.flvPlayer)
    },

    reloadVideo (flvPlayer) {
      this.destoryVideo(flvPlayer)
      this.createVideo()
    },
    destoryVideo (item, flvPlayer) {
      if (item.downTime) {
        clearInterval(item.downTime)
        item.downTime = null
      }
      flvPlayer.pause()
      flvPlayer.unload()
      flvPlayer.detachMediaElement()
      flvPlayer.destroy()
      flvPlayer = null
    },
    play () {
      this.loading = Loading.service({
        spinner: 'el-icon-loading',
        fullscreen: true,
        text: '加载中...',
        background: 'rgba(0,0,0,0.5)'
      })
      this.playShow = true
      this.rtspArr.forEach((item, index) => {
        this.createVideo(this.rtspArr[index], item.url, this.$refs[`video-${index}`][0], index)
      })
    },
    destroy () {
      this.flvPlayerList.forEach((item, index) => {
        this.destoryVideo(this.rtspArr[index], item)
      })
      this.playShow = false
    },
    logout () {
      ipcRenderer.send('exit', true)
    }
  }
}
</script>

<style lang="less" scoped>
video{
  display: block;
}
.video {
  width: 100%;
  height: 100%;
  background-color: black;

  &-com{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  &-box{
    width: calc(1920px / 4);
    height: calc(1080px / 4);
    position: relative;
    margin-right: 10px;
    .control{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 40px;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      color: white;
      padding: 0 10px;
      box-sizing: border-box;
      opacity: 0;
      transition: all 0.3s;
      li{
        user-select: none;
        cursor: pointer;
        margin-right: 10px;
        &:first-child{
          margin-left: auto;
        }
      }
    }
    &:hover{
      .control{
        opacity: 1;

      }
    }
  }
}
</style>
