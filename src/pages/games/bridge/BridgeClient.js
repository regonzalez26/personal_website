import { BridgePhases } from "./BridgePhases"
import { BridgeEvents } from "./server/BridgeEvents"
import { BridgeCommands } from "./BridgeCommands"
import { BridgePrompts } from "./utilities/BridgePrompt"
import { BridgePlayerActionData } from "./server/BridgePlayerActions"

export class BridgeClient {
  constructor(url, callBack){
    this.url = url
    this.callBack = callBack
    this.inititalize(url, callBack)
  }

  inititalize(url = this.url, callBack = this.callBack){
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
      case BridgeEvents.GAME_POOL_COMPLETE:
        this.handleGamePoolComplete()
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

  handleGameNotFound(){
    let msg = {
      command: BridgeCommands.PROMPT,
      prompt: BridgePrompts.GAME_NOT_FOUND
    }
    this.clientCallBack(msg)
  }

  handleNewGamePoolCreated(data){
    var msg = {
      command: BridgeCommands.SET_GAME_ID,
      gameId: data.gameId
    }
    this.clientCallBack(msg)
  }

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

  handleGamePoolComplete(){
    var msg = {
      command: BridgeCommands.PROMPT,
      prompt: BridgePrompts.START_GAME
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

    console.log(msg)

    this.clientCallBack(msg)
  }

//----------------GAME ACTIONS--------------------------

  createNewGame(localPlayerId){
    var data = BridgePlayerActionData.CREATE_NEW_GAME(localPlayerId)
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

  voteStartGame(gameId, localPlayerId){
    this.send({
      event: BridgeEvents.VOTE_START_GAME,
      data: {
        gameId: gameId,
        originPlayerId: localPlayerId
      }
    })
  }

  leaveGame(gameId, localPlayerId){
    this.send({
      event: BridgeEvents.PLAYER_LEAVE_GAME,
      data: {
        gameId: gameId,
        playerId: localPlayerId
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