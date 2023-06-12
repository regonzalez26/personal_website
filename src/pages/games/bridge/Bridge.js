import React from "react"

import Deck from "./components/Deck"
import Hand from "./components/Hand"
import Player from "./Player"

import "./Bridge.css"

class Bridge extends React.Component {
  static GamePhase = Object.freeze({Idle: 0, Betting: 1, PartnerPicking: 2, Rounds: 3, End: 4})

  constructor(props){
    super(props)
    this.deck = new Deck()
    this.hands = []
    this.props.setToolbars([
      {label: "New Game", fxn: this.newGame.bind(this)},
      {label: "End Game", fxn: ()=>{}}
    ]
    )
  }

  newGame(){
    this.deck.shuffle()
    this.hands = this.deck.distribute()
    this.setState({
      phase: Bridge.GamePhase.Betting,
      turnPlayerNo: 1
    })
  }

  render(){
    return (
      <div id="bridge-game-container">
        <div id="bridge-game-screen-container">
          
        </div>
        {
          this.hands.map((hand, index) => {
            return (
              <div key={Math.random()} id={`hands-container-${index}`}>
                <Player
                  playerNo={index+1}
                  active={this.state.turnPlayerNo === index+1}
                  phase={this.state.phase}
                  hand={<Hand cards={hand}/>}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Bridge