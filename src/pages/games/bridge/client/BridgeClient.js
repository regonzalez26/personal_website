import { BridgeCommands } from "../messaging/BridgeCommands"
import { BridgePlayerActionData, BridgePlayerActions } from "../messaging/BridgePlayerActions"

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

  handleMessage(message){
    if(message.type === 'response'){
      switch(message.responseFor){
        case BridgePlayerActions.CREATE_NEW_GAME:
          this.handleCreateNewGame(message.responseData)
          break
        case BridgePlayerActions.JOIN_GAME:
          this.handleJoinGame(message.responseData)
          break
        default:
          console.log(message)
          break
      }
    } else {
      console.log(message)
    }
  }

//-------------SERVER MESSAGE HANDLERS------------------

  handleCreateNewGame(responseData){
    let msg = {
      command: BridgeCommands.UPDATE_GAME,
      commandData: {
        game: responseData.game
      }
    }

    this.clientCallBack(msg)
  }

  handleJoinGame(responseData){
    let msg = {
      command: BridgeCommands.UPDATE_GAME,
      commandData: {
        game: responseData.game
      }
    }

    this.clientCallBack(msg)
  }

//----------------GAME ACTIONS--------------------------

  createNewGame(localPlayerId){
    var data = BridgePlayerActionData.CREATE_NEW_GAME(localPlayerId)
    this.send(data)
  }

  joinGame(gameCode, localPlayerId){
    var data = BridgePlayerActionData.JOIN_GAME(gameCode, localPlayerId)
    this.send(data)
  }

  leaveGame(){
    
  }

//-------------------------------------------

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