const SerialPort = window.require('serialport') // 串口通信npm包
const Readline = window.require('@serialport/parser-readline')
export default class SerialPorts {
  constructor ({ path }) {
    this.path = path // 串口的path值，或者linux/mac os为'/dev/tty-usbserial1'路径
    this.port = null
    this.parser = null // 创建一个流数据并且发送数据的结尾为 \n 或者 \r\n
    this.init() // 初始化
  }

  init () {
    this.port = new SerialPort(this.path, { autoOpen: false })
    this.parser = this.port.pipe(new Readline())
    this.port.open(err => {
      if (err) {
        throw err
      }
    })
  }

  /**
   * @param {Function} callback 回调函数
   * @memberof SerialPorts 接收返回数据
   */
  backMessage (callback) {
    this.parser.removeAllListeners()
    this.parser.on('data', data => {
      console.log(this.parser)
      callback(data)
    })
  }

  /**
   * 关闭串口
   */
  close () {
    this.port.close()
  }
}
