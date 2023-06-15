import React, {useState} from "react"

import Deck from "./components/Deck"
import Hand from "./components/Hand"
import Player from "./Player"

import "./Bridge.css"
import PlayingTable from "./PlayingTable"
import BridgeClient from "./BridgeClient"

const BridgeCommands  = Object.freeze({
  CREATE_NEW_PLAYER: "create_new_player"
})

export const BridgePhases = {
  Idle: "idle",
  WaitingForOtherPlayers:"waiting_for_other_players", 
  Betting: "betting",
  PartnerPicking: "partner_picking",
  Rounds: "rounds",
  End: "end"
}

function Bridge(props) {
  const [phase, setPhase]=useState(BridgePhases.Idle)
  const [activePlayer, _setActivePlayer] = useState(-1)
  const [notif, setNotif] = useState("Click New Game to Start")
  const [players, setPlayers] = useState([])
  const WS_URL = 'ws://localhost:8000'
  const [deck, setDeck] = useState(new Deck())
  const [game, setGame]=useState()

  const clientCallBack = (msg) => {
    switch(msg.command){
      case BridgeCommands.CREATE_NEW_PLAYER:
        setGame({
          gameId: msg.gameId,
          hands: msg.hands,
          localPlayerId: msg.playerId,
          phase: BridgePhases.WaitingForOtherPlayers
        })
        setNotif(`You are now joined in game ${msg.gameId}`)
        break;
      default:
        setNotif(msg)
        break;
    }
  }

  const [bridgeClient, setbridgeClient] = useState(new BridgeClient(WS_URL, clientCallBack.bind(this)))
  
  const endGame = () => {
    if(!bridgeClient.connected){ setNotif("Unable to Connect to Server. Try again.") }
    else { setNotif("Click New Game to Start")}

    setGame({})
  }

  const newGame = () => {
    if(!bridgeClient.connected){ setNotif("Unable to Connect to Server. Try again."); return}

    deck.shuffle()
    var newHands = deck.distribute()
    var firstPlayerId = Math.floor(Math.random() * 1000000)
    var labeledHands = []
    labeledHands.push({playerId: firstPlayerId, hand: newHands[0]})
    labeledHands.push({playerId: null, hand: newHands[1]})
    labeledHands.push({playerId: null, hand: newHands[1]})
    labeledHands.push({playerId: null, hand: newHands[1]})

    bridgeClient.makeNewGame(firstPlayerId, labeledHands)

    setGame({
      localPlayerId: firstPlayerId,
      hands: labeledHands,
      phase: BridgePhases.WaitingForOtherPlayers
    })

    setNotif("Set your bet!")
  }

  const inputGameCodeKeyDown = (event) =>  {
    if(event.keyCode === 13){
      var gameCode = event.currentTarget.value
      setNotif(`Joining Game No. ${gameCode}`)
      bridgeClient.joinGame(gameCode)
    }
  }

  const joinGame = () => {
    setNotif((
      <div id="enter-game-code-container">
        Enter Game Code: <input onKeyDown={inputGameCodeKeyDown} type="text" id="input-game-code"></input>
      </div>
    ))
  }

  const toolbars = [
    {label: "New Game", fxn: newGame},
    {label: "Join Game", fxn: joinGame},
    {label: "End Game", fxn: endGame},
  ]

  return (
    <div id="bridge-game-container">
      <div className="toolbars">
          {
            toolbars.map((toolbar) => {
              return <button key={Math.random()} onClick={()=>{toolbar.fxn()}}>{toolbar.label}</button>
            })
          }
      </div>
      <PlayingTable phase={phase} notif={notif}/>
      {
        game?.hands?.map((hand, index) => {
          if(hand.playerId === game.localPlayerId){
            return (
              <div key={Math.random()} id={`hands-container-0`}>
                <Player
                  bridgeClient={bridgeClient}
                  playerId={hand.playerId}
                  active={activePlayer === index+1}
                  phase={phase}
                  hand={<Hand cards={hand.hand}/>}
                />
              </div>
            )
          }
        })
      }
    </div>
  )
}

export default Bridge