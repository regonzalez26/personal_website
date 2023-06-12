import Card from "./Card";

class Deck {
  constructor(){
    let suites = [Card.CardSuite.Club, Card.CardSuite.Diamond, Card.CardSuite.Heart, Card.CardSuite.Spade]
    let numbers = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
    this.cards = []
    suites.forEach((suite) => {
      numbers.forEach((number)=>{
        this.cards.push({suite: suite, number: number})
      })
    })
  }

  shuffle(){
    let shuffledDeck = []

    for(let i=51; i>=0; i--){
      let getCardIndex = Math.floor(Math.random() * i)
      shuffledDeck.push(this.cards[getCardIndex])
      this.cards.splice(getCardIndex, 1)
    }

    this.cards = shuffledDeck
  }

  getTop(){}
  reset(){}

  distribute(){
    let hands = [[],[],[],[]]

    for(let i=0; i<this.cards.length; i++){
      hands[i%hands.length].push(this.cards[i])
    }

    return hands
  }
}

export default Deck