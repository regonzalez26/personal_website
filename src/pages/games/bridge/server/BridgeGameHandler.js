const { getHands } = require('./Deck')
const { BridgePhases } = require('../BridgePhases');

const createNewGame = (connection, firstPlayerId) => {
  let hands = getHands()
  let players = [
    {index: 0, hand: hands[0], connection: connection, id: firstPlayerId},
    {index: 1, hand: hands[1]},
    {index: 2, hand: hands[2]},
    {index: 4, hand: hands[3]}
  ]

  return {
    id: Math.floor(Math.random() * 1000000).toString(),
    players: players,
    phase: BridgePhases.WaitingForOtherPlayers
  }
}

const addPlayerToGame = (game, connection, playerId) => {
  for(let i=0; i<game.players.length; i++){
    if(!game.players[i].id){
      game.players[i].connection = connection
      game.players[i].id = playerId
      break
    }
  }
}

module.exports = { createNewGame, addPlayerToGame }