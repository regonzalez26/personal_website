const BridgeEvents = Object.freeze({
  SERVER_CONNECTION_SUCCEEDED: "server_connection_succeeded",
  NEW_GAME_POOL: "new_game_pool",
  NEW_GAME_POOL_CREATED: "new_game_pool_created",
  JOIN_GAME_POOL: "join_game_pool",
  JOIN_GAME_POOL_SUCCESS: "join_game_pool_success",
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
      this.handleMessage(event)
    }
  }

  handleMessage(event){
    switch(event.event){
      case BridgeEvents.NEW_GAME_POOL_CREATED:
        this.handleNewGamePoolCreated(event.data)
        this.clientCallBack(event.data)
        break;
      case BridgeEvents.JOIN_GAME_POOL_SUCCESS:
        this.handleJoinGamePoolSuccess(event.data)
        this.clientCallBack(event.data)
        break;
      default:
        this.clientCallBack(event.data)
        break;
    }
  }

  handleJoinGamePoolSuccess(data){
    
  }

  handleNewGamePoolCreate(data){
    this.gameId = data.gameId;
  }

//-------------GAME ACTIONS-----------------

  makeNewGame(firstPlayerId){
    this.localPlayerId = firstPlayerId
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

  joinGame(gameId){
    this.localPlayerId = this.createLocalPlayerId()
    this.send({
      event: BridgeEvents.JOIN_GAME_POOL,
      data: {
        playerId: this.localPlayerId,
        gameId: gameId
      }
    })
  }

//-------------------------------------------

  createLocalPlayerId(){
    return Math.floor(Math.random() * 1000000)
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