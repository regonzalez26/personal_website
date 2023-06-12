import React from "react"

import Card from "./Card"
import "./HandRow.css"

class HandRow extends React.Component{
  state = {
    cards: []
  }

  constructor(props){
    super(props)
    this.init()
  }

  init(){
    this.cards = this.props.cards
    this.handCount = this.cards.length
    this.setDimensions()
  }

  setDimensions(){
    this.handWidth = this.handCount * 25
    this.handRadius = this.handCount * 25
    this.totalHandAngle = 2*Math.atan(this.handWidth/(2*this.handRadius))*(180/Math.PI)
    this.minCardRotation = this.totalHandAngle/this.handCount
  }

  getRotation(index){
    var indexFromMid = index - (this.handCount-1)/2
    return Math.floor(this.minCardRotation * indexFromMid)
  }

  getRadiusLoss(rotDeg){
    var rotRad = Math.PI * (rotDeg)/180
    var hyp = this.handRadius/Math.cos(rotRad)
    return Math.floor(hyp-this.handRadius)
  }

  getLeftMargin(index){
    var indexFromMid = index - this.handCount/2
    return Math.floor(indexFromMid*(this.handWidth/this.handCount))
  }

  componentDidUpdate(prevProps){
    if(prevProps.cards !== this.props.cards){
      this.init()
    }
  }

  render(){
    return(
      <div className="hand-row">
        {
          this.props.cards.map((card, index, cards) => {
            let rot = this.getRotation(index)
            let radLoss = this.getRadiusLoss(rot)
            let leftMargin = this.getLeftMargin(index)
            return (
            <div key={index} className="card-wrapper"
              style={{left: `${leftMargin}px`, transform: `rotate(${rot}deg) translateY(${radLoss}px)`}}>
                <Card suite={card.suite} number={card.number}/>
            </div>
            )
          })
        }
      </div>
    )
  }
}

export default HandRow