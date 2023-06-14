import React, {useState} from "react"

import Deck from "./components/Deck"
import Hand from "./components/Hand"
import Player from "./Player"

import "./Bridge.css"
import PlayingTable from "./PlayingTable"
import { BridgeEvents } from "./server/DataStructures"
import BridgeClient from "./BridgeClient"

export const BridgePhases = {Idle: 0, Betting: 1, PartnerPicking: 2, Rounds: 3, End: 4}

function Bridge(props) {
  const [phase, setPhase]=useState(BridgePhases.Idle)
  const [activePlayer, _setActivePlayer] = useState(-1)
  const [notif, setNotif] = useState("Click New Game to Start")
  const [players, setPlayers] = useState([])
  const WS_URL = 'ws://localhost:8000'
  const [deck, setDeck] = useState(new Deck())
  const [hands, setHands]=useState([])

  const clientCallBack = (msg) => {
    setNotif(msg)
  }

  const [bridgeClient, setbridgeClient] = useState(new BridgeClient(WS_URL, clientCallBack.bind(this)))
  
  const endGame = () => {
    if(!bridgeClient.connected){ setNotif("Unable to Connect to Server. Try again.") }
    else { setNotif("Click New Game to Start")}

    setHands([])
    setPlayers([])
    setPhase(BridgePhases.End)
    bridgeClient.close()
  }

  const newGame = () => {
    if(!bridgeClient.connected){ setNotif("Unable to Connect to Server. Try again."); return}

    deck.shuffle()
    setHands(deck.distribute())
    setPhase(BridgePhases.Betting)
    setNotif("Set your bet!")

    var localPlayerId = Math.floor(Math.random() * 1000000)
    setPlayers([localPlayerId])
    bridgeClient.makeNewGame(localPlayerId)
  }

  const inputGameCodeKeyDown = (event) =>  {
    if(event.keyCode === 13){
      var gameCode = event.currentTarget.value
      setNotif(`Joining Game No. ${gameCode}`)
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
        players.map((player, index) => {
          return (
            <div key={Math.random()} id={`hands-container-${index}`}>
              <Player
                bridgeClient={bridgeClient}
                playerId={players[index]}
                active={activePlayer === index+1}
                phase={phase}
                hand={<Hand cards={hands[index]}/>}
              />
            </div>
          )
        })
      }
    </div>
  )
}

export default Bridge