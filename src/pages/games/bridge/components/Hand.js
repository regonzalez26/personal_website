import React from "react"

import HandRow from "./HandRow"
import "./Hand.css"
import Card from "./Card"

class Hand extends React.Component {
  constructor(props){
    super(props)
    this.init()
  }

  init(){
    this.cards = this.props.cards
    this.cardgroup = this.arrangeBySuite()
  }

  sortedInsert(cards, cardToInsert){
    if(cards.length === 0){
      cards.push(cardToInsert)
      return cards
    }

    var cardToInsertIndex = Card.CardNumbers.indexOf(cardToInsert.number)
    for(let i=0; i<cards.length; i++){
      var currentCardIndex = Card.CardNumbers.indexOf(cards[i].number)
      if(currentCardIndex <= cardToInsertIndex){
        if(i===0){
          cards.unshift(cardToInsert)
        } else {
          cards.splice(i, 0, cardToInsert)
        }
        break;
      } else if (i===cards.length-1){
        cards.push(cardToInsert)
        break
      }
    }

    return cards
  }

  arrangeBySuite(){
    let cardGroupBySuite = [[],[],[],[]]
    this.cards.forEach((card)=>{
      switch(card.suite){
        case Card.CardSuite.Club:
          cardGroupBySuite[0] = this.sortedInsert(cardGroupBySuite[0], card)
          break;
        case Card.CardSuite.Diamond:
          cardGroupBySuite[1] = this.sortedInsert(cardGroupBySuite[1], card)
          break;
        case Card.CardSuite.Heart:
          cardGroupBySuite[2] = this.sortedInsert(cardGroupBySuite[2], card)
          break;
        default:
        case Card.CardSuite.Spade:
          cardGroupBySuite[3] = this.sortedInsert(cardGroupBySuite[3], card)
          break;
      }
    })


    var rowA = cardGroupBySuite[0].concat(cardGroupBySuite[1])
    var rowB = cardGroupBySuite[2].concat(cardGroupBySuite[3])

    if(rowA.length > rowB.length){
      return [rowA, rowB]
    } else {
      return [rowB, rowA]
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.cards != this.props.cards){
      this.init()
    }
  }

  render(){
    return (
    <div className="hand">
      {
        this.cardgroup.map((cardgroup, index) => {
          return (
            <div
              className="hand-row-container"
              key={Math.random()}
              style = {{transform: `translateY(${index*50}px)`}}
            >
                <HandRow width={250} radius={500} cards={cardgroup} />
            </div>
          )
        })
      }
    </div>
    )
  }
}

export default Hand