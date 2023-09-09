const { BridgeMessageTypes } = require('../messaging/BridgeMessages')
const { BridgePlayerActions } = require('../messaging/BridgePlayerActions')
const { getClientGame } = require("./BridgeGameFormatter")

const BridgeServerResponses = Object.freeze({
  CREATE_NEW_GAME: (game) => {
    return {
      type: BridgeMessageTypes.RESPONSE,
      responseFor: BridgePlayerActions.CREATE_NEW_GAME,
      responseData: {
        game: getClientGame(game)
      }
    }
  },
  JOIN_GAME: (game) => {
    return {
      type: BridgeMessageTypes.RESPONSE,
      responseFor: BridgePlayerActions.JOIN_GAME,
      responseData: {
        game: getClientGame(game)
      }
    }
  }
})

module.exports = { BridgeServerResponses }