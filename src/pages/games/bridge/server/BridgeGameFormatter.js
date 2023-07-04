const getClientGame = (game) => {
  // Filter Information Sent in Game.Players
  let filteredPlayers = []
  game.players.forEach((player)=>{
    let filteredPlayerInfo = {}
    filteredPlayerInfo.id = player.id
    filteredPlayerInfo.hand = player.hand
    filteredPlayers.push(filteredPlayerInfo)
  })

  return {
    id: game.id,
    players: filteredPlayers,
    phase: game.phase,
  }
}

module.exports = { getClientGame }