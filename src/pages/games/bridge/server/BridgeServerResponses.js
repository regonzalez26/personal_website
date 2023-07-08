const { BridgePlayerActions } = require('../messaging/BridgePlayerActions')

const BridgeServerResponses = Object.freeze({
  CREATE_NEW_GAME: (game) => {
    return {
      type: "response",
      responseFor: BridgePlayerActions.CREATE_NEW_GAME,
      responseData: {
        game: game
      }
    }
  }
})

module.exports = { BridgeServerResponses }