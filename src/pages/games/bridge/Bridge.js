import React, { useCallback, useRef, useState, useEffect } from "react"

import Deck from "./components/Deck"
import Hand from "./components/Hand"
import Player from "./Player"

import "./Bridge.css"
import { BridgeClient, BridgeCommands } from "./BridgeClient"
import { BridgePlayerActions } from "./server/BridgePlayerActions"

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

const getPlayerActionNotif = (action, actionData) => {
  let notif = ""

  switch(action){
    case BridgePlayerActions.JOIN_GAME:
      notif = <div>PLAYER {actionData.playerInfo.id} has joined the game.<br></br>Waiting for others...</div>
      break
    default:
      notif = ""
      break
  }

  return notif
}

function Bridge(props) {
  const [activePlayer] = useState(-1)
  const [notif, setNotif] = useState()
  const [prompt, setPrompt] = useState()
  const WS_URL = 'ws://localhost:8000'
  const [deck] = useState(new Deck())
  const [game, setGame]= useState({})
  const stateRef = useRef()
  const playerIcons = [
    playerIcon1,
    playerIcon2,
    playerIcon3,
    playerIcon4
  ]

  const setDisappearingNotif = (notif, timeout = 5000) => {
    setNotif(notif)

    setTimeout(()=>{
      setNotif()
    }, timeout)
  }

  stateRef.game = game

  const clientCallBack = useCallback((msg) => {
    switch(msg.command){
      case BridgeCommands.CREATE_NEW_PLAYER:
        setGame({
          id: msg.gameId,
          hands: msg.hands,
          localPlayerId: msg.playerId,
          phase: msg.phase
        })
        setDisappearingNotif(<div>You have joined game <br></br>{msg.gameId}</div>)
        break;
      case BridgeCommands.SET_GAME_ID:
        setGame({...stateRef.game, id: msg.gameId})
        break;
      case BridgeCommands.UPDATE_GAME:
        setDisappearingNotif(getPlayerActionNotif(msg.action, msg.actionData))
        setGame({...stateRef.game, hands: msg.game.hands})
        break;
      default:
        setNotif(JSON.stringify(msg))
        break;
    }
  },[])

  const [bridgeClient] = useState(new BridgeClient(WS_URL, clientCallBack))
  
  useEffect(()=>{
    return () => {
      bridgeClient.close()
    }
  },[bridgeClient])


  // const endGame = () => {
  //   if(!bridgeClient.connected){ setNotif("Unable to Connect to Server. Try again.") }
  //   else { setNotif("Click New Game to Start")}

  //   setGame({})
  //   setbridgeClient({})
  // }

  const newGame = () => {
    if(!bridgeClient.connected){ setNotif("Unable to Connect to Server. Try again."); return}

    deck.shuffle()
    var newHands = deck.distribute()
    var firstPlayerId = Math.floor(Math.random() * 1000000)
    var labeledHands = []
    labeledHands.push({icon: 0, playerId: firstPlayerId, hand: newHands[0]})
    labeledHands.push({playerId: null, hand: newHands[1]})
    labeledHands.push({playerId: null, hand: newHands[2]})
    labeledHands.push({playerId: null, hand: newHands[3]})

    bridgeClient.makeNewGame(firstPlayerId, labeledHands)

    setPrompt()
    setGame({
      localPlayerId: firstPlayerId,
      hands: labeledHands,
      phase: BridgePhases.WaitingForOtherPlayers
    })
  }

  const inputGameCodeKeyDown = (event) =>  {
    if(event.keyCode === 13){
      var gameCode = event.currentTarget.value
      setPrompt()
      bridgeClient.joinGame(gameCode)
    }
  }

  const joinGame = () => {
    setGame({})
    setPrompt((
      <div id="enter-game-code-container">
        <p>Enter Game Code</p>
        <input onKeyDown={inputGameCodeKeyDown} type="text" id="input-game-code"></input>
      </div>
    ))
  }

  const toolbars = [
    {label: "New Game", fxn: newGame},
    {label: "Join Game", fxn: joinGame}
  ]

  console.log(game)

  const arrangement = []
  game?.hands?.forEach((hand)=>{
    if(hand.playerId === game.localPlayerId){
      arrangement.unshift(hand)
    } else {
      arrangement.push(hand)
    }
  })

  return (
    <div id="bridge-game-container">
      <div id="bridge-game-header">
        {
          toolbars.map((toolbar, index) => {
            let toolbarButton = <button key={Math.random()} onClick={()=>{toolbar.fxn()}}>{toolbar.label}</button>
            let titleBar = index >= toolbars.length/2 ? <div key={Math.random()} id="bridge-game-title">Bridge</div> : null
            return [titleBar, toolbarButton]
          })
        }
      </div>
      <div id="bridge-game-notif-bar">{notif}</div>
      {prompt}
      <div id="bridge-playing-table">
        {
          arrangement.map((hand, index) => {
              return (
                <div key={Math.random()} className={`hands-container-${index}`}>
                  <Player
                    key={Math.random()}
                    bridgeClient={bridgeClient}
                    playerId={hand.playerId}
                    phase={game.phase}
                    hand={<Hand cards={hand.hand}/>}
                    isLocalPlayer={index === 0}
                    playerIcon = {playerIcons[hand.icon]}
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