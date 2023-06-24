const { WebSocketServer } = require('ws');
const http = require('http');

const { BridgeEvents } = require("./BridgeEvents");
const { BridgePlayerActions } = require('./BridgePlayerActions');
const { BridgePhases } = require('../BridgePhases');

//--------------------INIITIALIZE SERVER---------------------------
const BRIDGE_SERVER_PORT = Object.freeze(8000)
gamePools = [];
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
    filteredHandInfo.icon = hand.icon
    hands.push(filteredHandInfo)
  })

  return {
    id: gamePool.id,
    hands: hands,
    phase: gamePool.phase,
    startVotes: gamePool.startVotes
  }
}

const findGameById = (gameId) => {
  let gamePool
  gamePools.forEach((game) => {
    if(game.id === gameId){
      gamePool = game
    }
  })
  return gamePool
}

const deleteGame = (gameId) => {
  gamePools = gamePools.filter((game) => game.id != gameId)
}

const updateOtherPlayers = (originPlayerId, gamePool, playerAction, playerActionData = {}) => {
  gamePool.hands.forEach((hand) => {
    if(hand.playerId != originPlayerId && hand.connection){
      hand.connection.send(JSON.stringify({
          event: BridgeEvents.PLAYER_ACTION,
          data: {game: getGameInfo(gamePool), action: playerAction, actionData: playerActionData}
        })
      )
    }
  })
}

const sendToallPlayers = (gamePool, bridgeEvent, data) => {
  gamePool.hands.forEach((hand)=>
  {
    if(hand.connection){
      hand.connection.send(JSON.stringify({
        event: bridgeEvent,
        data: data
      }))
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
    id: Math.floor(Math.random() * 1000000).toString(),
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
        gamePoolToJoin.hands[i].icon = i
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

    updateOtherPlayers(data.playerInfo.id, gamePoolToJoin, BridgePlayerActions.JOIN_GAME, {playerInfo: data.playerInfo})
    displayGamePools()
    if(gamePoolToJoin.hands.filter((h)=>!h.playerId).length === 0){
      sendToallPlayers(gamePoolToJoin, BridgeEvents.GAME_POOL_COMPLETE)
    }
  } else {
    connection.send(JSON.stringify({
      event: BridgeEvents.GAME_NOT_FOUND
    }))
  }
}

const handleVoteStartGame = (connection, data) => {
  let game = findGameById(data.gameId)
  game.startVotes = game.startVotes ? game.startVotes + 1 : 1
  if(game.startVotes === 4){ game.phase = BridgePhases.Betting }
  console.log(`START VOTES: ${game.startVotes}`)
  console.log(`GAME PHASE: ${game.phase}`)
  updateOtherPlayers(data.originPlayerIdlayerId, game, BridgePlayerActions.VOTE_START_GAME, {playerInfo: {id: data.originPlayerId}})
}

const handlePlayerLeaveGame = (connection, data) => {
  let game = findGameById(data.gameId)
  if(!game){ return }

  let endForAll = false

  game.hands.forEach((hand) => {
    if(hand.playerId === data.playerId){
      endForAll = game.phase > BridgePhases.VOTING_TO_START_GAME
      hand.connection = null
      hand.playerId = null
    }
  })

  if(endForAll){
    deleteGame(game.id)
    updateOtherPlayers(data.playerId, game, BridgePlayerActions.LEAVE_GAME, {playerInfo: {id: data.playerId}, endGame: true})
  } else {
    if(game.hands.filter((h)=>h.playerId).length === 0){
      deleteGame(game.id)
      return
    }

    game.startVotes = 0
    game.phase = BridgePhases.WaitingForOtherPlayers
    updateOtherPlayers(data.playerId, game, BridgePlayerActions.LEAVE_GAME, {playerInfo: {id: data.playerId}})
  }

  displayGamePools()
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
  console.log("------------------------")

  if(gamePools.length == 0){
    console.log("No game pools.")
    return
  }

  gamePools.forEach((gamePool) => {
    console.log(`Game Pool Id: ${gamePool.id}`)
    console.log(`\tPlayers`)
    gamePool.hands.forEach((hand, index) => {
      if(hand.playerId){
        console.log(`\t${index+1}. ${hand.playerId}: Connection: ${hand.connection.readyState}`)
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
        break
      case BridgeEvents.VOTE_START_GAME:
        handleVoteStartGame(connection, msg.data)
        break
      case BridgeEvents.PLAYER_LEAVE_GAME:
        handlePlayerLeaveGame(connection, msg.data)
        break
      default:
        handleDefault(msg.data)
    }
  })
  
    connection.on("close",(ws, n, reason) => {
      console.log(`Connection for ${ws} closed`)
    })
})