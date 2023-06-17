const { WebSocketServer } = require('ws');
const http = require('http');
const { uuid } = require('uuidv4')

const { BridgeEvents } = require("./BridgeEvents");
const { BridgePlayerActions } = require('./BridgePlayerActions');

//--------------------INIITIALIZE SERVER---------------------------
const BRIDGE_SERVER_PORT = Object.freeze(8000)
const gamePools = [];
const server = http.createServer()
const ws = new WebSocketServer({server})
server.listen(BRIDGE_SERVER_PORT, ()=>{ console.log(`Server is running on port ${BRIDGE_SERVER_PORT}`)})

//-------------------HELPER FUNCTIONS-------------------------------
const getGameInfo = (gamePool) => {
  let hands = []
  gamePool.hands.forEach((hand)=>{
    let filteredHandInfo = {}
    filteredHandInfo.playerId = hand.playerId,
    filteredHandInfo.hand = hand.hand
    hands.push(filteredHandInfo)
  })

  return {
    id: gamePool.id,
    hands: hands
  }
}

const updateGameForAllPlayers = (originPlayerId, gamePool, playerAction, playerActionData = {}) => {
  gamePool.hands.forEach((hand) => {
    if(hand.playerId != originPlayerId && hand.connection){
      hand.connection.send(JSON.stringify({
          event: BridgeEvents.PLAYER_ACTION,
          data: {...getGameInfo(gamePool), action: playerAction, actionData: playerActionData}
        })
      )
    }
  })
}

//-----------------------------EVENT HANDLERS-----------------------------------

const handleNewGamePool = (connection, data) => {
  let hands = data.hands

  for(let i=0; i<hands.length; i++){
    if(hands[i].playerId){
      hands[i].connection = connection
    }
  }

  var gamePool = {
    id: uuid(),
    hands: hands,
    phase: data.phase
  }

  gamePools.push(gamePool)

  connection.send(JSON.stringify({
      event: BridgeEvents.NEW_GAME_POOL_CREATED,
      data: {
        gameId: gamePool.id
      }
    })
  )

  displayGamePools()
}

const handleJoinGamePool = (connection, data) => {
  var gamePoolToJoin

  gamePools.forEach((gamePool) => {
    if(gamePool.id === data.gameId){
      if(gamePool.hands.filter((h)=>h.playerId).length >= 4){ return }

      gamePoolToJoin = gamePool
    }
  })

  if(gamePoolToJoin){
    for(let i=0; i<gamePoolToJoin.hands.length; i++){
      if(!gamePoolToJoin.hands[i].playerId){
        gamePoolToJoin.hands[i].playerId = data.playerInfo.id
        gamePoolToJoin.hands[i].connection = connection
        break
      }
    }

    connection.send(JSON.stringify({
        event: BridgeEvents.JOIN_GAME_POOL_SUCCESS,
        data: {
          id: gamePoolToJoin.id,
          hands: gamePoolToJoin.hands,
          phase: gamePoolToJoin.phase
        }
      })
    )

    updateGameForAllPlayers(data.playerInfo.id, gamePoolToJoin, BridgePlayerActions.JOIN_GAME, {playerInfo: data.playerInfo})
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

//-----------------------------HELPER FUNCTIONS---------------------------------

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