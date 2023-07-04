const { WebSocketServer } = require('ws');
const http = require('http');

const { BridgeEvents } = require("./BridgeEvents");
const { BridgePlayerActions } = require('./BridgePlayerActions');

const { createNewGame } = require('./BridgeGameHandler');
const { saveGame, getAllGames } = require('./BridgeGameStorage');
const { getClientGame } = require('./BridgeGameFormatter')

//---------------------------INIITIALIZE SERVER---------------------------------
const BRIDGE_SERVER_PORT = Object.freeze(8000)
const server = http.createServer()
const ws = new WebSocketServer({server})
server.listen(BRIDGE_SERVER_PORT, ()=>{ console.log(`Server is running on port ${BRIDGE_SERVER_PORT}`)})
const memoryObject = {}

//----------------------------HELPER FUNCTIONS----------------------------------

const send = (connection, JSONdata) => {
  connection.send(JSON.stringify(JSONdata))
}

//-----------------------------EVENT HANDLERS-----------------------------------

const handleCreateNewGame = (connection, data) => {
  let game = createNewGame(connection, data.playerId)
  saveGame(memoryObject, game)
  let clientGame = getClientGame(game)

  send(connection, {
      event: BridgeEvents.NEW_GAME_POOL_CREATED,
      data: {
        game: clientGame
      }
  })

  displayGames(getAllGames(memoryObject))
}

//-----------------------------HELPER FUNCTIONS---------------------------------

const displayGames = (games) => {
  console.log("------------------------")

  if(games.length == 0){
    console.log("No game pools.")
    return
  }

  games.forEach((game) => {
    console.log(`Game Id: ${game.id}`)
    console.log(`\tPlayers`)
    game.players.forEach((player, index) => {
      if(player.id){
        console.log(`\t${index+1}. ${player.id}: Connection: ${player.connection.readyState}`)
      }
    })
  })
}

const msgActionHandlers = {}
msgActionHandlers[BridgePlayerActions.CREATE_NEW_GAME] = handleCreateNewGame


ws.on('connection', function(connection) {
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