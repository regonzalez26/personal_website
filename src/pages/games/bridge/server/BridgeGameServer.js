const { WebSocketServer } = require('ws');
const http = require('http');

const { BridgePlayerActions } = require('../messaging/BridgePlayerActions')
const { getResponses, sendResponses } = require('./BridgeServerResponseHandler')

const { createNewGame, addPlayerToGame } = require('./BridgeGameHandler')
const { saveGame, getAllGames, getGameById } = require('./BridgeGameStorage')

//---------------------------INIITIALIZE SERVER---------------------------------
const BRIDGE_SERVER_PORT = Object.freeze(8000)
const server = http.createServer()
const ws = new WebSocketServer({server})
server.listen(BRIDGE_SERVER_PORT, ()=>{ console.log(`Server is running on port ${BRIDGE_SERVER_PORT}`)})
const memoryObject = {}

//----------------------------HELPER FUNCTIONS----------------------------------

const displayGames = (games) => {
  console.log("------------------------")

  if(games.length == 0){
    console.log("No game pools.")
    return
  }

  games.forEach((game) => {
    console.log(`Game Id: ${game.id}`)
    console.log(`\tPhase: ${game.phase}`)
    console.log(`\tPlayers`)
    game.players.forEach((player, index) => {
      if(player.id){
        console.log(`\t${index+1}. ${player.id}: Connection: ${player.connection.readyState}`)
      }
    })
  })
}

//-----------------------------EVENT HANDLERS-----------------------------------

const handleCreateNewGame = (connection, data) => {
  let game = createNewGame(connection, data.playerId)
  saveGame(memoryObject, game)
  let responses = getResponses.CREATE_NEW_GAME(game, data.playerId)
  sendResponses(responses)
  displayGames(getAllGames(memoryObject))
}

const handleJoinGame = (connection, data) => {
  let game = getGameById(memoryObject, data.gameId)
  addPlayerToGame(game, connection, data.playerId)
  let responses = getResponses.JOIN_GAME(game, data.playerId)
  sendResponses(responses)
  displayGames(getAllGames(memoryObject))
}

const msgActionHandlers = {}
msgActionHandlers[BridgePlayerActions.CREATE_NEW_GAME] = handleCreateNewGame
msgActionHandlers[BridgePlayerActions.JOIN_GAME] = handleJoinGame

//-----------------------CONNECTION EVENT LISTENERS-------------------------------


ws.on('connection', function(connection) {
  console.log("new connection made to server")
  
  connection.on("message",(data)=>{
    let msg = JSON.parse(data)
    let [action, actionData] = [msg.action, msg.actionData]
    var handler = msgActionHandlers[action]

    if(handler){
      handler(connection,actionData)
    } else {
      console.log(JSON.stringify(actionData))
    }
  })
  
  connection.on("close",(ws, n, reason) => {
    console.log(`Connection for ${ws} closed`)
  })
})