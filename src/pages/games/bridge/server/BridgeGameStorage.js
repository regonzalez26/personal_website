const saveGame = (memoryObject, game) => {
  if(!memoryObject.games){ memoryObject.games = [] }

  memoryObject.games.push(game)
  return true
}

const getAllGames = (memoryObject) => {
  if(!memoryObject.games){ memoryObject.games = [] }
  return memoryObject.games
}

module.exports = { saveGame, getAllGames }