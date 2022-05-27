import renders from './renders'

export function bufToFile (buf, filename) {
  return new File([buf], filename)
}

export async function readBuffer (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = loadEvent => resolve(loadEvent.target.result)
    reader.onerror = e => reject(e)
    reader.readAsArrayBuffer(file)
  })
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

export async function readDataURL (buffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = loadEvent => resolve(loadEvent.target.result)
    reader.onerror = e => reject(e)
    reader.readAsDataURL(new Blob([buffer]))
  })
}

export async function readText (buffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = loadEvent => resolve(loadEvent.target.result)
    reader.onerror = e => reject(e)
    reader.readAsText(new Blob([buffer]), 'utf-8')
  })
}

export function getExtend (name) {
  const dot = name.lastIndexOf('.')
  return name.substr(dot + 1)
}

export async function render (buffer, type, target) {
  const handler = renders[type]
  if (handler) {
    return handler(buffer, target)
  }
  return renders.error(buffer, target, type)
}
