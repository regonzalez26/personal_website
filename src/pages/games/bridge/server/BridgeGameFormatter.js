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

const getActorConnection = (game, actorId) => {
  let actorConnection
  let otherConnections = []
  
  game.players?.forEach((p)=>{
    if(p.id === actorId){
      actorConnection = p.connection
    } else if (p.connection) {
      otherConnections.push(p.connection)
    }
  })

  return {
    actorConnection: actorConnection,
    otherConnections: otherConnections
  }
}

module.exports = { getClientGame, getActorConnection }