import React from "react"

import Bridge from "./Bridge"
import "./Player.css"
import PlayerBetOptions from "./PlayerBetOptions"

class Player extends React.Component {
  constructor(props){
    super(props)
    this.hand = this.props.hand
  }

  render(){
    let playerActions
    if(this.props.phase === Bridge.GamePhase.Betting){
      playerActions = <PlayerBetOptions />
    }

    let playerStatus = this.props.phase === Bridge.GamePhase.Rounds && this.props.active ? "Your turn!" : "Waiting for others..."
    playerStatus = this.props.phase === Bridge.GamePhase.Betting ? "Set your bet!" : "Waiting for others..."

    return (
      <div className="player-container">
        <div className={this.props.phase === Bridge.GamePhase.Rounds && this.props.active ? "player-actions-container active" : "player-actions-container"}>
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