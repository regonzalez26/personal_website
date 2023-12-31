const BridgeEvents = Object.freeze({
  SERVER_CONNECTION_SUCCEEDED: "server_connection_succeeded",
  NEW_GAME_POOL: "new_game_pool",
  NEW_GAME_POOL_CREATED: "new_game_pool_created",
  JOIN_GAME_POOL: "join_game_pool",
  JOIN_GAME_POOL_SUCCESS: "join_game_pool_success",
  GAME_POOL_COMPLETE: "game_pool_complete",
  VOTE_START_GAME: "vote_start_game",
  PLAYER_LEAVE_GAME: "player_leave_game",
  GAME_NOT_FOUND: "game_not_found",
  PLAYER_ACTION: "player_action"
})

module.exports = { BridgeEvents }