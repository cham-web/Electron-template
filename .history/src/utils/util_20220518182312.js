export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 *js将秒转换为日时分秒
 * @param {*} s
 * @returns
 */
export function secondsFormat (s) {
  var day = Math.floor(s / (24 * 3600)) // Math.floor()向下取整
  var hour = Math.floor((s - day * 24 * 3600) / 3600)
  var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60)
  var second = s - day * 24 * 3600 - hour * 3600 - minute * 60
  return day + '天' + hour + '时' + minute + '分' + second + '秒'
}

/**
 * 图片压缩
 * @param {HTMLElement} image 创建的图片元素
 * @param {File} file File对象
 * @param {number} quality 图片压缩质量 0-1
 * @returns {Blob} Blob对象
 */
export function compressUpload (image, file, quality) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const { width, height } = image
  canvas.width = width
  canvas.height = height
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0, width, height)
  const compressData = canvas.toDataURL(file.type, quality || 0.7)
  console.log(file)
  const blobImg = dataURLtoFile(compressData, file.name, file.uid)
  return blobImg
}
/**
 * base64转换为Blob对象
 * @param {string} dataurl
 * @returns Blob
 */
export function dataURLtoBlob (dataurl) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  console.log(mime)
  return new Blob([u8arr], { type: mime })
}

/**
 * base64转换为File对象
 * @param {string} dataurl
 * @returns Blob
 */
export function dataURLtoFile (dataurl, filename, uid) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  console.log(mime)
  const file = new File([u8arr], filename, { type: mime })
  file.uid = uid
  return file
}

export function bufToFile (buf, filename, type) {
  return new File([buf], filename, { type })
}

export function fileToBuf (file, cb) {
  var fr = new FileReader()
  var filename = file.name

  fr.readAsArrayBuffer(file)
  fr.addEventListener('loadend', (e) => {
    var buf = e.target.result
    cb(buf, filename)
  }, false)
}

export function bufToBlob (buf, mimeType = '') {
  return new Blob([buf], { type: mimeType })
}

export function blobToBuf (blob, cb) {
  var fr = new FileReader()
  var type = blob.type

  fr.readAsArrayBuffer(blob)
  fr.addEventListener('loadend', (e) => {
    var buf = e.target.result
    cb(buf, type)
  }, false)
}

export function fileType (type) {
  const typeObj = {
    wordproces: '.docx',
    sheet: '.xlsx',
    presentationml: '.pptx',
    jpeg: '.jpeg',
    png: '.png',
    gif: '.gif',
    jpg: '.jpg',
    text: '.txt',
    pdf: '.pdf'
  }
  let fileType = ''

  for (const key in typeObj) {
    if (type.indexOf(key) !== -1) {
      fileType = typeObj[key]
    }
  }
  return fileType
}

/**
 * 数据流导出excel文件
 * @export
 * @param {*} res 后端返回数据
 */
export function exportExcel (res) {
  const blob = new Blob([res.data], {
    type: res.headers['content-type']
  })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = res.headers['content-disposition'].match(/filename=(.*?);/)[1]
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * 字符串转换bytes数组
 * @param {*} str
 * @returns {Array} bytes
 */
export function stringToBytes (str) {
  var bytes = []
  var len, c
  len = str.length
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0)
      bytes.push(((c >> 12) & 0x3F) | 0x80)
      bytes.push(((c >> 6) & 0x3F) | 0x80)
      bytes.push((c & 0x3F) | 0x80)
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0)
      bytes.push(((c >> 6) & 0x3F) | 0x80)
      bytes.push((c & 0x3F) | 0x80)
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0)
      bytes.push((c & 0x3F) | 0x80)
    } else {
      bytes.push(c & 0xFF)
    }
  }
  return bytes
};

/**
 * 统一处理socket返回回来的数据
 * @param {*} resultCode
 * @param {*} callback
 */
export function renderSocketMessage (resultCode, callback) {
  return new Promise((resolve, reject) => {
    switch (resultCode) {
      case 1:
        resolve(1)
        break
      case 2:
        // #endif
        reject(new Error(2))
        break
      case 3:
        // #endif
        reject(new Error('设备离线'))
        break
    }
  })
}
