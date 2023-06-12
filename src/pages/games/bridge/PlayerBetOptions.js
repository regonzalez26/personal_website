import React from "react"

import "./PlayerBetOptions.css"

class PlayerBetOptions extends React.Component{
  static suites = Object.freeze(["Club", "Diamond", "Heart", "Spade"])
  static betNumbers = Object.freeze([1,2,3,4,5,6,7])
  state = {}

  setSuite(suite){
    this.setState({suite: suite})
  }

  setBetNum(level){
    this.setState({betNum: level})
  }

  render(){
    let betBtn = this.state.suite?.length>0 && this.state.betNum>0 ? <button>BET</button> : ""
    return (
      <div className="bet-buttons-container">
        <div id="suite-buttons">
          {
            PlayerBetOptions.suites.map((suite) => {
              return <button
                className = {this.state.suite === suite ? "active" : ""}
                onClick={this.setSuite.bind(this, suite)}
                key={Math.random()}>
                  {suite}
                </button>
            })
          }
        </div>
        <div id="bet-numbers">
          {
            PlayerBetOptions.betNumbers.map((betNum) => {
              return <button
                className = {this.state.betNum === betNum ? "active" : ""}
                onClick = {this.setBetNum.bind(this, betNum)}
                key={Math.random()}>
                  {betNum}
                </button>
            })
          }
          {betBtn}
          <button>CALL</button>
        </div>
      </div>
    )
  }
}

export default PlayerBetOptions