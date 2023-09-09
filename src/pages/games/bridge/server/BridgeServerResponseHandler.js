const { BridgeServerResponses } = require("./BridgeServerResponses")
const { BridgeResponseNotifications } = require("./BridgeServerResponseNotifications")
const { getActorConnection } = require("./BridgeGameFormatter")
const { createMessage, sendMessage, sendMultipleMessages } = require("./BridgeServerMessages")
const { BridgePlayerActions } = require("../messaging/BridgePlayerActions")

const generateResponses = (game, actorId, actorMessage, otherPlayerMessage) => {
  let connections = getActorConnection(game, actorId)
  return {
    actorResponse: createMessage(connections.actorConnection, actorMessage),
    otherPlayerResponses: connections.otherConnections.map((connection) => {
      return createMessage(connection, otherPlayerMessage)
    })
  }
}

const sendResponses = (responses) => {
  sendMessage(responses.actorResponse)
  sendMultipleMessages(responses.otherPlayerResponses)
}

const getResponses = Object.freeze({
  CREATE_NEW_GAME: (game, actorId) => {
    return generateResponses(game, actorId, BridgeServerResponses.CREATE_NEW_GAME(game))
  },
  JOIN_GAME: (game, actorId) => {
    return generateResponses(game, actorId, BridgeServerResponses.JOIN_GAME(game), BridgeResponseNotifications.JOIN_GAME(game, actorId))
  }
})

module.exports = { getResponses, sendResponses }