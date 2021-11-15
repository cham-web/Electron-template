/* eslint-disable no-plusplus */
import message from './Message_pb'
import { stringToBytes } from './util'
const CySocket = function (config) {
  this.server = config ? config.server || '' : ''
  this.autoReconnect = config ? config.autoReconnect || '' : true
  let times = 0// 尝试连接三次
  let interval
  const cySocket = this
  // 接收返回的值函数，返回接收的数据
  this.receiveMessage = function (data) {
    return data
  }
  // 初始化socket
  this.init = function (callback) {
    if (this.server === '') {
      console.error('服务器地址不能为空:)')
      return
    }
    if (interval) {
      clearInterval(interval)
      interval = null
      times = 0
    }
    try {
      if (cySocket.socket && cySocket.socket.readyState === 1) return
      cySocket.socket = new WebSocket(this.server)
      cySocket.socket.onopen = function (data) {
        if (config && config.openSocket) config.openSocket.call(cySocket, data)
      }
      cySocket.socket.binaryType = 'arraybuffer'
      // cySocket.socket.onmessage = function (msg) {
      //   cySocket.receiveMessage(msg.data);
      //   // if (config && config.receiveMsg) config.receiveMsg.call(cySocket, msg.data);
      // };
      interval = setInterval(() => {
        if (cySocket.socket.readyState !== 1) {
          if (times > 2) {
            clearInterval(interval)
            interval = null
            times = 0
            // console.log("无法连接到服务器...:)");
            return
          }
          // console.log("通讯异常,正在尝试重连...:)");
          if (cySocket.socket) {
            cySocket.socket.close()
          }
          cySocket.socket = new WebSocket(config.server)

          times++
        } else {
          clearInterval(interval)
          interval = null
          times = 0
          // console.log("已经连接到服务器");
        }
      }, 5000)
      if (typeof (callback) === 'function') callback.call(cySocket)
    } catch (e) {
      console.log(e.message)
      if (this.autoReconnect) {
        this.init(callback)
      }
    }
  }

  this.close = function () {
    if (interval) {
      clearInterval(interval)
      interval = null
      times = 0
    }
    if (cySocket.socket && cySocket.socket.readyState === 1) {
      cySocket.socket.close()
    }
  }

  this.sendMsg = function (data) {
    if (!cySocket.socket || cySocket.socket.readyState !== 1) {
      this.init(config)
    }

    const arrayBuffer = new ArrayBuffer(data.length + 10)
    console.log(arrayBuffer, 75)
    const dataView = new DataView(arrayBuffer)
    dataView.setInt32(0, data.length + 10, true)// 指定小端，主机字节序设置
    for (let i = 0; i < data.length; i++) {
      dataView.setUint8(i + 9, data[i])
    }
    const bytes = stringToBytes('ASXC') // 前面4位转换为bytes数组
    const type = new Uint8Array(bytes) // 前面4位

    for (let i = 0; i < type.length; i++) {
      dataView.setUint8(i, type[i])
    }
    dataView.setUint8(7, data.length + 10)
    // 转换为可操作的数组 TypedArray
    const typeArray = new Uint8Array(dataView.buffer)
    console.log(type)

    let init
    for (const item of typeArray) { // 循环全部的值
      init ^= item // 获取异或值
    }
    console.log(init)
    // dataView.setUint8(dataView.byteLength - 2, 0x0D);
    dataView.setUint8(dataView.byteLength - 1, init) // 最后一位设置异或值
    if (cySocket.socket && cySocket.socket.readyState === 1) {
      cySocket.socket.send(dataView.buffer)
    }
  }
  this.backMsg = function (res) {
    const typedArray = new Uint8Array(res.data)
    const result = typedArray.slice(9, typedArray.length - 1)
    var deMessage = message.FirstAidCmd.deserializeBinary(result)
    return deMessage
  }
  this.checkSocketState = function () {
    return cySocket.socket.readyState
  }
}
export default CySocket
