import React, {useCallback, useRef, useState} from "react"

import Deck from "./components/Deck"
import Hand from "./components/Hand"
import Player from "./Player"

import "./Bridge.css"
import PlayingTable from "./PlayingTable"
import { BridgeClient, BridgeCommands } from "./BridgeClient"

import playerIcon1 from "../bridge/assets/remote-player-icon-0.jpg"
import playerIcon2 from "../bridge/assets/remote-player-icon-1.jpg"
import playerIcon3 from "../bridge/assets/remote-player-icon-2.jpg"
import playerIcon4 from "../bridge/assets/remote-player-icon-3.jpg"

export const BridgePhases = {
  Idle: "idle",
  WaitingForOtherPlayers:"waiting_for_other_players", 
  Betting: "betting",
  PartnerPicking: "partner_picking",
  Rounds: "rounds",
  End: "end"
}

function Bridge(props) {
  const [activePlayer, _setActivePlayer] = useState(-1)
  const [notif, setNotif] = useState("Click New Game to Start")
  const [players, setPlayers] = useState([])
  const WS_URL = 'ws://localhost:8000'
  const [deck, setDeck] = useState(new Deck())
  const [game, setGame]= useState({})
  const stateRef = useRef()
  const playerIcons = [
    playerIcon1,
    playerIcon2,
    playerIcon3,
    playerIcon4
  ]

  stateRef.game = game

  const clientCallBack = useCallback((msg) => {
    switch(msg.command){
      case BridgeCommands.CREATE_NEW_PLAYER:
        setGame({
          id: msg.gameId,
          hands: msg.hands,
          localPlayerId: msg.playerId,
          phase: BridgePhases.WaitingForOtherPlayers
        })
        setNotif(`You are now joined in game ${msg.gameId}`)
        break;
      case BridgeCommands.SET_GAME_ID:
        setGame({...stateRef.game, id: msg.gameId})
        break;
      case BridgeCommands.UPDATE_GAME:
        setGame({...stateRef.game, hands: msg.game.hands})
        break;
      default:
        setNotif(msg)
        break;
    }
  },[])

  const [bridgeClient, setbridgeClient] = useState(new BridgeClient(WS_URL, clientCallBack))
  
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
    labeledHands.push({playerId: null, hand: newHands[2]})
    labeledHands.push({playerId: null, hand: newHands[3]})

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
    //{label: "End Game", fxn: endGame},
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
      <PlayingTable phase={game.phase} notif={notif}/>
      <div id="bridge-playing-table">
      {
        game?.hands?.map((hand, index) => {
          let isLocalPlayer = hand.playerId === game.localPlayerId

            return (
              <div key={Math.random()} className={isLocalPlayer ? `hands-container-local` : `hands-container`}>
                <Player
                  bridgeClient={bridgeClient}
                  playerId={hand.playerId}
                  phase={game.phase}
                  hand={<Hand cards={hand.hand}/>}
                  isLocalPlayer={isLocalPlayer}
                  playerIcon = {playerIcons[index]}

                  active={activePlayer === index+1}
                />
              </div>
            )
        })
      }
      </div>
    </div>
  )
}

export default Bridge