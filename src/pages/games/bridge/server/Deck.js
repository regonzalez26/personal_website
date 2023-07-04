const getHands = () => {
    var suites = ["clubs.png", "diamond.png", "heart.png", "spade.png"]
    var numbers = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
    var cards = []

    suites.forEach((suite) => {
      numbers.forEach((number)=>{
        cards.push({suite: suite, number: number})
      })
    })

    let shuffledDeck = []

    for(let i=51; i>=0; i--){
      let getCardIndex = Math.floor(Math.random() * i)
      shuffledDeck.push(cards[getCardIndex])
      cards.splice(getCardIndex, 1)
    }

    let hands = [[],[],[],[]]

    for(let i=0; i<shuffledDeck.length; i++){
      hands[i%hands.length].push(shuffledDeck[i])
    }

    return hands
}

module.exports = { getHands }