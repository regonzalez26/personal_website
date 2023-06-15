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
  GAME_NOT_FOUND: "game_not_found",
  BET: "bet"
})

const gamePools = [];

const server = http.createServer()
const ws = new WebSocketServer({server})
server.listen(BRIDGE_SERVER_PORT, ()=>{ console.log(`Server is running on port ${BRIDGE_SERVER_PORT}`)})

const handleNewGamePool = (connection, data) => {
  var gamePool = {
    id: uuid(),
    connection: connection,
    hands: data.hands
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
  console.log("Joining game pool")
  var gamePoolToJoin

  gamePools.forEach((gamePool) => {
    if(gamePool.id === data.gameId){
      gamePoolToJoin = gamePool
    }
  })

  if(gamePoolToJoin){
    for(let i=0; i<gamePoolToJoin.hands.length; i++){
      if(!gamePoolToJoin.hands[i].playerId){
        gamePoolToJoin.hands[i].playerId = data.playerInfo.id
        break
      }
    }

    connection.send(JSON.stringify({
        event: BridgeEvents.JOIN_GAME_POOL_SUCCESS,
        data: {
          id: gamePoolToJoin.id,
          hands: gamePoolToJoin.hands
        }
      })
    )

    displayGamePools()
  } else {
    connection.send(JSON.stringify({
      event: BridgeEvents.GAME_NOT_FOUND
    }))
  }
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
    console.log(`Game Pool Id: ${gamePool.id}`)
    console.log(`\tPlayers`)
    gamePool.hands.forEach((hand, index) => {
      if(hand.playerId){
        console.log(`\t${index+1}. ${hand.playerId}`)
      }
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