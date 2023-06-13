import { BridgePhases } from "./Bridge"

const BridgeEvents = Object.freeze({
  SERVER_CONNECTION_SUCCEEDED: "server_connection_succeeded",
  NEW_GAME_POOL: "new_game_pool",
  NEW_GAME_POOL_CREATED: "new_game_pool_created",
  JOIN_GAME_POOL: "join_game_pool",
  BET: "bet"
})

class BridgeClient {
  constructor(url, callBack){
    this.server = new WebSocket(url)
    this.clientCallBack = callBack
    this.server.onopen = () => {
      this.connected = true
    }

    this.server.onmessage = (event) => {
      this.handleMessage(event.data)
    }
  }

  handleMessage(event){
    this.clientCallBack(event)
  }

  makeNewGame(firstPlayerId){
    var data = {
      event: BridgeEvents.NEW_GAME_POOL,
      data: {
        playerInfo: {
          id: firstPlayerId
        }
      }
    }
    this.send(data)
  }

  getServer(){
    return this.server
  }

  send(jsonData){
    if(!this.server || !this.connected){ return false }

    this.server.send(JSON.stringify(jsonData))
    return true
  }

  close(){
    if(!this.server) { return false }

    this.server.close()
    return true
  }
}

export default BridgeClient