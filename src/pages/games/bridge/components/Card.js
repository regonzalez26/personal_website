import React from "react"

import "./Card.css"

class Card extends React.Component{
  static CardSuite = Object.freeze({
    Club:"clubs.png", Diamond: "diamond.png", Heart: "heart.png", Spade: "spade.png"
  })

  static CardNumbers = Object.freeze(["2","3","4","5","6","7","8","9","10","J","Q","K","A"])

  constructor(props){
    super(props)
    this.suite = this.props.suite
    this.number = this.props.number
  }

  render(){
    return (
    <div className="card">
      <span className="suite-number">{this.number}</span>
      <img className="suite-image" src={require(`../assets/${this.suite}`)} alt="suite"/>
    </div>
    )
  }
}

export default Card