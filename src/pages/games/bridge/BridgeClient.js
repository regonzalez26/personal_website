import { BridgePhases } from "./Bridge"
import { BridgeEvents } from "./server/BridgeEvents"
import { BridgePlayerActions } from "./server/BridgePlayerActions"

export const BridgeCommands  = Object.freeze({
  CREATE_NEW_PLAYER: "create_new_player",
  SET_GAME_ID: "set_game_id",
  UPDATE_GAME: "update_game"
})

export class BridgeClient {
  constructor(url, callBack){
    this.server = new WebSocket(url)
    this.connected = false
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
        break
      case BridgeEvents.JOIN_GAME_POOL_SUCCESS:
        this.handleJoinGamePoolSuccess(event.data)
        break
      case BridgeEvents.GAME_NOT_FOUND:
        this.handleGameNotFound()
        break
      case BridgeEvents.PLAYER_ACTION:
        this.handlePlayerAction(event.data)
        break
      default:
        console.log(event)
        break
    }
  }

//-------------SERVER MESSAGE HANDLERS------------------

  handleJoinGamePoolSuccess(data){
    var msg = {
      command: BridgeCommands.CREATE_NEW_PLAYER,
      playerId: this.localPlayerId,
      hands: data.hands,
      gameId: data.id,
      phase: data.phase
    }
    this.clientCallBack(msg)
  }

  handleGameNotFound(){
    this.clientCallBack("Game Not Found")
  }

  handleNewGamePoolCreated(data){
    var msg = {
      command: BridgeCommands.SET_GAME_ID,
      gameId: data.gameId
    }
    this.clientCallBack(msg)
  }

  handlePlayerAction(data){
    let msg = {
      command: BridgeCommands.UPDATE_GAME,
      game: data.game,
      action: data.action,
      actionData: data.actionData
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
        hands: hands,
        phase: BridgePhases.WaitingForOtherPlayers
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