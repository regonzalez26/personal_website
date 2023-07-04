const { getHands } = require('./Deck')
const { BridgePhases } = require('../BridgePhases');

const createNewGame = (connection, firstPlayerId) => {
  let hands = getHands()
  let players = [
    {index: 0, id: firstPlayerId, connection: connection, hand: hands[0]},
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

module.exports = { createNewGame }