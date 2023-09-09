const sendMessage = (message) => {
  message.connection.send(JSON.stringify(message.JSONData))
  return true
}

const sendMultipleMessages = (messages) => {
  let success = messages.map((message) => sendMessage(message))
  return success
}

const createMessage = (connection, JSONData) => {
  return {
    connection: connection,
    JSONData: JSONData
  }
}

module.exports = { sendMessage, sendMultipleMessages, createMessage }