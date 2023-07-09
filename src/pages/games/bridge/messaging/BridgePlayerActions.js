const BridgePlayerActions = Object.freeze({
  CREATE_NEW_GAME: "create_new_game",
  JOIN_GAME: "join_game"
})

const BridgePlayerActionData = Object.freeze({
  CREATE_NEW_GAME: (playerId) => {
    return {
      action: BridgePlayerActions.CREATE_NEW_GAME,
      actionData: {
        playerId: playerId
      }
    }
  },
  JOIN_GAME: (gameId, playerId) => {
    return {
      action: BridgePlayerActions.JOIN_GAME,
      actionData: {
        gameId: gameId,
        playerId: playerId
      }
    }
  }
})

module.exports = { BridgePlayerActions, BridgePlayerActionData }