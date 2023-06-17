import React from "react"
import { BridgePhases } from "./Bridge"
import "./Player.css"

class Player extends React.Component {
  constructor(props){
    super(props)
    this.hand = props.hand
    this.playerId = props.playerId
    this.bridgeClient = props.bridgeClient
  }

  render(){
    // --------- PLAYER ACTIONS-------------------------
    // let playerActions
    // if(this.props.phase === BridgePhases.Betting){
    //   playerActions = <PlayerBetOptions playerId={this.playerId} bridgeClient={this.bridgeClient}/>
    // }

    // --------- PLAYER STATUS TEXT---------------------
    let playerStatus = this.props.phase === BridgePhases.Rounds && this.props.active ? "Your turn!" : "Waiting for others..."
    playerStatus = this.props.phase === BridgePhases.Betting ? "Set your bet!" : "Waiting for others..."
    playerStatus = `#${this.playerId}:` +  playerStatus

    if(this.playerId){
    return (
      <div className="player-container">
        <div className="player-hands-container">
          {this.props.isLocalPlayer ? this.hand : ""}
        </div>

        <div className="player-info-container">
          <div className={`remote-player-icon`} style={{backgroundImage: `url(${this.props.playerIcon})`}}></div>
          <div className="player-game-status-container">
            {playerStatus}
          </div>
          {/* <div className={this.props.phase === BridgePhases.Rounds && this.props.active ? "player-actions-container active" : "player-actions-container"}>
            {playerActions}
          </div> */}
        </div>
      </div>
    )
    }
  }
}

export default Player