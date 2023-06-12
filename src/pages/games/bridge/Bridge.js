import React from "react"

import Deck from "./components/Deck"
import Hand from "./components/Hand"

import "./Bridge.css"
import HandRow from "./components/HandRow"

class Bridge extends React.Component {
  state = {gameId: 1}

  constructor(props){
    super(props)
    this.deck = new Deck()
    this.hands = []
  }

  newGame(){
    this.deck.shuffle()
    this.hands = this.deck.distribute()
    this.setState({gameId: Math.random()})
  }

  startGame(){
    this.startBettingPhase()
  }

  startBettingPhase(){

  }

  render(){
    return (
      <div id="bridge-game-container">
        <button onClick={this.newGame.bind(this)}>New Game</button>
        {
          this.hands.map((hand, index) => {
            return (
              <div key={Math.random()} id={`hands-container-${index}`}>
                <Hand cards={hand}/>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Bridge