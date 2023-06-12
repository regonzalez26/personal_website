const http = require('node:http')
const { EventEmitter } = require('node:events')
const crypto = require('node:crypto')

class BridgeGameServer extends EventEmitter {
  constructor(options = {}){
    super()
    this._port = options.port || 4000
    this.GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
    this._init()
  }

  _init(){
    if(this._server) throw new Error('Server already initialized')

    this._server = http.createServer((req, res) => {
      const UPGRADE_REQUIRED = 426
      const body = http.STATUS_CODES[UPGRADE_REQUIRED]
      res.writeHead(UPGRADE_REQUIRED, {
        'Content-Type': 'text/plain',
        'Upgrade': 'WebSocket'
      })
      res.end(body)
    })

    this._server.on('upgrade', (req, socket) => {
      console.log('upgrade!')
      this.emit('headers', req)

      if(req.headers.upgrade !== 'websocket'){
        socket.end('HTTP/1.1 400 Bad Request')
        return
      }

      const acceptKey = req.headers['sec-websocket-key']
      const acceptValue = this._generateAcceptValue(acceptKey)

      const responseheaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-Websocket-Accept: ${acceptValue}`
      ]

      socket.write(responseheaders.concat('\r\n').join('\r\n'))
    })
  }

  _generateAcceptValue(acceptKey){
    return crypto
      .createHash('sha1')
      .update(acceptKey + this.GUID, 'binary')
      .digest('base64')
  }
}

const PORT = 4000
const server = new BridgeGameServer({port: PORT})

server.on('headers', ({headers}) => console.log(headers))
server._server.listen(PORT, () => {
  console.log(`Bridge Game Server Listening on Port ${PORT}`)
})