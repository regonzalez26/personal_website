const BridgePlayerActions = Object.freeze({
  CREATE_NEW_GAME: "create_new_game"
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
})

module.exports = { BridgePlayerActions, BridgePlayerActionData }