const BridgePhases = {
  Idle: 0,
  WaitingForOtherPlayers: 1, 
  VOTING_TO_START_GAME: 2,
  Betting: 3,
  PartnerPicking: 4,
  Rounds: 5,
  End: 6
}

module.exports = { BridgePhases }