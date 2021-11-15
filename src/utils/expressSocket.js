function expressWs () {
  const express = require('express')
  const path = require('path')
  const ffmpeg = require('fluent-ffmpeg')
  console.log(path.resolve(__dirname, '../public/ffmpeg/bin/', 'ffmpeg.exe'))
  ffmpeg.setFfmpegPath(path.resolve(__dirname, '../ffmpeg/bin/', 'ffmpeg.exe'))
  const webSocketStream = require('websocket-stream/stream')

  const app = express()

  require('express-ws')(app)

  console.log(express.static(__dirname), '12---------')
  app.use(express.static(__dirname))

  app.ws('/rtsp/:id', rtspRequestHandle)

  function rtspRequestHandle (ws, req) {
    console.log('rtsp request handle')
    const stream = webSocketStream(ws, {
      binary: true,
      browserBufferTimeout: 1000000
    }, {
      browserBufferTimeout: 1000000
    })

    const url = req.query.url
    console.log(`rtsp url: "${url}"`)
    console.log('rtsp params:', req.params)

    try {
      ffmpeg(url)
      // .input(`audio=${audio}`)
        .addOptions([
          '-vcodec libx264'
          // '-preset ultrafast',
          // '-acodec aac',
          // '-pix_fmt yuv422p'
        ])
        .on('start', () => {
          console.log(`"${url}" stream started.`)
        })
        .on('codecData', (data) => {
          console.log(data)
          console.log(`"${url}" stream codecData.`)
        })
        .on('error', (err, stdout, stderr) => {
          console.log(`"${url}" An Error occured: ${err.message}`)
          // console.log(stdout);
          // console.log(stderr);
        })
        .on('end', () => {
          console.log(`"${url}" stream end.`)
        })
      // .flvmeta()
        .outputFormat('flv').videoCodec('copy').noAudio().pipe(stream)
    } catch (error) {
      console.log(error, '85-------')
    }
  }

  app.listen(16001)
}

module.exports = expressWs
