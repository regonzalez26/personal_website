import { BridgePlayerActionData, BridgePlayerActions } from "../messaging/BridgePlayerActions"

export class BridgeClient {
  constructor(url, callBack){
    this.url = url
    this.callBack = callBack
    this.inititalize(url, callBack)

    this.handlers = {}
    this.handlers[BridgePlayerActions.CREATE_NEW_GAME] = this.handleCreateNewGame
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
      this.handlers[message.responseFor](message.responseData)
    } else {
      console.log(message)
    }
  }

//-------------SERVER MESSAGE HANDLERS------------------

  handleCreateNewGame(responseData){
    console.log(responseData)
  }

//----------------GAME ACTIONS--------------------------

  createNewGame(localPlayerId){
    var data = BridgePlayerActionData.CREATE_NEW_GAME(localPlayerId)
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