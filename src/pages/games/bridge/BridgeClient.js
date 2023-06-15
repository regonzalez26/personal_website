const BridgeEvents = Object.freeze({
  SERVER_CONNECTION_SUCCEEDED: "server_connection_succeeded",
  NEW_GAME_POOL: "new_game_pool",
  NEW_GAME_POOL_CREATED: "new_game_pool_created",
  JOIN_GAME_POOL: "join_game_pool",
  JOIN_GAME_POOL_SUCCESS: "join_game_pool_success",
  GAME_NOT_FOUND: "game_not_found",
  BET: "bet"
})

export const BridgeCommands  = Object.freeze({
  CREATE_NEW_PLAYER: "create_new_player",
  SET_GAME_ID: "set_game_id"
})

export class BridgeClient {
  constructor(url, callBack){
    this.server = new WebSocket(url)
    this.clientCallBack = callBack
    this.server.onopen = () => {
      this.connected = true
    }

    this.server.onclose = () => {
      this.connected = false
    }

    this.server.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data))
    }
  }

  handleMessage(event){
    switch(event.event){
      case BridgeEvents.NEW_GAME_POOL_CREATED:
        this.handleNewGamePoolCreated(event.data)
        break;
      case BridgeEvents.JOIN_GAME_POOL_SUCCESS:
        this.handleJoinGamePoolSuccess(event.data)
        break;
      case BridgeEvents.GAME_NOT_FOUND:
        this.handleGameNotFound()
        this.clientCallBack("Game Not Found")
        break;
      default:
        this.clientCallBack(event.data)
        break;
    }
  }

//-------------SERVER MESSAGE HANDLERS------------------

  handleJoinGamePoolSuccess(data){
    console.log(data)
    var msg = {
      command: BridgeCommands.CREATE_NEW_PLAYER,
      playerId: this.localPlayerId,
      hands: data.hands,
      gameId: data.id
    }
    this.clientCallBack(msg)
  }

  handleGameNotFound(){

  }

  handleNewGamePoolCreated(data){
    var msg = {
      command: BridgeCommands.SET_GAME_ID,
      gameId: data.gameId
    }
    this.clientCallBack(msg)
  }

//----------------GAME ACTIONS--------------------------

  makeNewGame(firstPlayerId, hands){
    this.localPlayerId = firstPlayerId
    var data = {
      event: BridgeEvents.NEW_GAME_POOL,
      data: {
        playerInfo: {
          id: firstPlayerId
        },
        hands: hands
      }
    }
    this.send(data)
  }

  joinGame(gameId){
    this.localPlayerId = this.createLocalPlayerId()
    this.send({
      event: BridgeEvents.JOIN_GAME_POOL,
      data: {
        playerInfo: {
          id: this.localPlayerId
        },
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