const { getClientGame } = require("./BridgeGameFormatter")
const { BridgeMessageTypes } = require("../messaging/BridgeMessages")

const BridgeServerResponseNotificationTypes = {
  UPDATE_GAME: "update_game"
}

const BridgeResponseNotifications = Object.freeze({
  JOIN_GAME: (game, actorId) => {
    return {
      type: BridgeMessageTypes.NOTIFICATION,
      notifType: BridgeServerResponseNotificationTypes.UPDATE_GAME,
      notifFrom: actorId,
      notifData: {
        game: getClientGame(game)
      }
    }
  }
})

module.exports = { BridgeResponseNotifications, BridgeServerResponseNotificationTypes }