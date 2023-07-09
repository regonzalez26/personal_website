// CREATE 

const { memo } = require("react")

const saveGame = (memoryObject, game) => {
  if(!memoryObject.games){ memoryObject.games = [] }

  memoryObject.games.push(game)
  return true
}

// READ

const getAllGames = (memoryObject) => {
  if(!memoryObject.games){ memoryObject.games = [] }
  return memoryObject.games
}

const getGameById = (memoryObject, gameId) => {
  if(!memoryObject.games){ memoryObject.games = [] }
  let game = memoryObject.games.filter(game => game.id === gameId)
  return game.length ? game[0] : null
}

module.exports = { saveGame, getAllGames, getGameById }