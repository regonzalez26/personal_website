import React from "react"
import { BridgePhases } from "./Bridge"
import "./Player.css"
import PlayerBetOptions from "./PlayerBetOptions"

class Player extends React.Component {
  constructor(props){
    super(props)
    this.hand = props.hand
    this.playerId = props.playerId
    this.bridgeClient = props.bridgeClient
  }

  render(){
    let playerActions
    if(this.props.phase === BridgePhases.Betting){
      playerActions = <PlayerBetOptions playerId={this.playerId} bridgeClient={this.bridgeClient}/>
    }

    let playerStatus = this.props.phase === BridgePhases.Rounds && this.props.active ? "Your turn!" : "Waiting for others..."
    playerStatus = this.props.phase === BridgePhases.Betting ? "Set your bet!" : "Waiting for others..."

    return (
      <div className="player-container">
        <div className={this.props.phase === BridgePhases.Rounds && this.props.active ? "player-actions-container active" : "player-actions-container"}>
          {playerActions}
          <div className="player-game-status-container">
            {playerStatus}
          </div>
        </div>
        <div className="player-hands-container">
          {this.hand}
        </div>
      </div>
    )
  }
}

export default Player