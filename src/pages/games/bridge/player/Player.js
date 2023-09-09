import React from "react"
import "./Player.css"
import PlayerBetOptions from "./PlayerBetOptions"
import { BridgePhases } from "../BridgePhases"

class Player extends React.Component {
  constructor(props){
    super(props)
    this.hand = props.hand
    this.isLocalPlayer = props.isLocalPlayer
    this.playerId = props.playerId
    this.bridgeClient = props.bridgeClient
    this.gamePhase = props.phase
  }

  render(){
    // --------- PLAYER STATUS TEXT---------------------
    let playerStatus = `#${this.playerId}`

    let playerBetOptions = this.gamePhase === BridgePhases.Betting && this.isLocalPlayer ? <PlayerBetOptions /> : ""

    if(this.playerId){
    return (
      <div className="player-container">
        <div className="player-hands-container">
          {this.isLocalPlayer ? this.hand : ""}
        </div>

        <div className="player-info-container">
          <div className={`remote-player-icon`} style={{backgroundImage: `url(${this.props.playerIcon})`}}></div>
          <div className="player-game-status-container">
            {playerStatus}
          </div>
        </div>

        {playerBetOptions}
      </div>
    )
    }
  }
}

export default Player