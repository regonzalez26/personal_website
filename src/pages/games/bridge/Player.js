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
    // --------- PLAYER STATUS TEXT---------------------
    let playerStatus = `#${this.playerId}`

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