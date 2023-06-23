const BridgePhases = {
  Idle: "idle",
  WaitingForOtherPlayers:"waiting_for_other_players", 
  VOTING_TO_START_GAME: "voting_to_start_game",
  Betting: "betting",
  PartnerPicking: "partner_picking",
  Rounds: "rounds",
  End: "end"
}

module.exports = { BridgePhases }