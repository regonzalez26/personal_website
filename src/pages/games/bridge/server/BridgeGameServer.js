const { WebSocketServer } = require('ws');
const http = require('http');
const { uuid } = require('uuidv4')

const BRIDGE_SERVER_PORT = Object.freeze(8000)

const BridgeEvents = Object.freeze({
  SERVER_CONNECTION_SUCCEEDED: "server_connection_succeeded",
  NEW_GAME_POOL: "new_game_pool",
  NEW_GAME_POOL_CREATED: "new_game_pool_created",
  JOIN_GAME_POOL: "join_game_pool",
  JOIN_GAME_POOL_SUCCESS: "join_game_pool_success",
  BET: "bet"
})

const gamePools = [];

const server = http.createServer()
const ws = new WebSocketServer({server})
server.listen(BRIDGE_SERVER_PORT, ()=>{ console.log(`Server is running on port ${BRIDGE_SERVER_PORT}`)})

const handleNewGamePool = (connection, data) => {
  var gamePool = {
    gameId: uuid(),
    connection: connection,
    players: [data.playerInfo]
  }
  gamePools.push(gamePool)
  connection.send(JSON.stringify({
      event: BridgeEvents.NEW_GAME_POOL_CREATED,
      data: {
        gameId: gamePool.gameId
      }
    })
  )

  displayGamePools()
}

const handleJoinGamePool = (connection, data) => {
  gamePools.forEach((gamePool) => {
    if(gamePool.gameId === data.gameId){
      gamePool.players.push({
        id: data.playerId
      })
    }
  })

  connection.send(JSON.stringify({
      event: BridgeEvents.JOIN_GAME_POOL_SUCCESS,
      data: {
        hands: ["5D", "2H"]
      }
    })
  )
}

const handleBet = (connection, data) => {
  connection.send(JSON.stringify({
      gameId: data.gameId,
      playerId: data.playerId,
      suite: data.suite,
      betNum: data.betNum
    })
  )
}

const handleDefault = (data) => {
  console.log(`Received data: ${JSON.stringify(data)}`)
}

const displayGamePools = () => {
  if(gamePools.length == 0){
    console.log("No game pools.")
    return
  }

  gamePools.forEach((gamePool) => {
    console.log(`Game Pool Id: ${gamePool.gameId}`)
    console.log(`\tPlayers`)
    gamePool.players.forEach((player, index) => {
      console.log(`\t${index+1}. ${player.id}`)
    })
  })
}

ws.on('connection', function(connection) {
  connection.on("message",(data, is_binary)=>{
    var msg = JSON.parse(data)

    switch(msg.event){
      case BridgeEvents.NEW_GAME_POOL:
        handleNewGamePool(connection, msg.data)
        break;
      case BridgeEvents.JOIN_GAME_POOL:
        handleJoinGamePool(connection, msg.data)
        break;
      case BridgeEvents.BET:
        handleBet(connection, msg.data)
      default:
        handleDefault(msg["data"])
    }
  })
  
    connection.on("close",(ws, n, reason) => {
      console.log(`Connection for ${n} closed`)
    })
})