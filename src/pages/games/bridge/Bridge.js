import React, { useCallback, useRef, useState, useEffect } from "react"

import Deck from "./components/Deck"

import "./Bridge.css"
import { BridgeClient } from "./BridgeClient"
import { BridgeCommands } from "./BridgeCommands"
import { BridgeNotifications, getPlayerActionNotif } from "./utilities/BridgeNotifications"

import { BridgePrompt, BridgePrompts } from "./utilities/BridgePrompt"
import { BridgeToolbar } from "./utilities/BridgeToolbar"
import { BridgePlayingTable } from "./utilities/BridgePlayingTable"
import { BridgePhases } from "./BridgePhases"

function Bridge(props) {
  const [activePlayer] = useState(-1)
  const [notif, setNotif] = useState()
  const [prompt, setPrompt] = useState()
  const WS_URL = 'ws://localhost:8000'
  const [deck] = useState(new Deck())
  const [game, setGame]= useState({})
  const stateRef = useRef()
  stateRef.game = game

  //---------------------------------UTILITY FUNCTIONS-------------------------------

  const setDisappearingNotif = (notif, timeout = 5000) => {
    setNotif(notif)

    setTimeout(()=>{
      setNotif()
    }, timeout)
  }

  const inputGameCodeKeyDown = (event) =>  {
    if(event.keyCode === 13){
      let gameCode = event.currentTarget.value
      setPrompt()
      bridgeClient.joinGame(gameCode)
    }
  }

  //----------------------------------CLIENT AND CALLBACKS---------------------------
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

  //---------------------------------PLAYER ACTIONS---------------------------------

  const newGame = () => {
    if(!bridgeClient.connected){ setPrompt({prompt: BridgePrompts.SERVER_DOWN}); return}

    deck.shuffle()
    var newHands = deck.distribute()
    var firstPlayerId = Math.floor(Math.random() * 1000000)
    var labeledHands = []
    newHands.forEach((hand, index)=>{
      let labeledHand = (index === 0) ? {icon: 0, playerId: firstPlayerId, hand: newHands[index]} : {hand: newHands[index]}
      labeledHands.push(labeledHand) 
    })

    bridgeClient.makeNewGame(firstPlayerId, labeledHands)

    setPrompt()
    setGame({
      localPlayerId: firstPlayerId,
      hands: labeledHands,
      phase: BridgePhases.WaitingForOtherPlayers
    })
  }

  const joinGame = () => {
    setGame({})

    if(bridgeClient?.connected){
      setPrompt({
        prompt: BridgePrompts.ENTER_GAME_CODE,
        onKeyDown: inputGameCodeKeyDown
      })
    } else {
      setPrompt({
        prompt: BridgePrompts.SERVER_DOWN
      })
    }
  }

  const [toolbars, setToolbars] = useState([
    {label: "New Game", fxn: newGame},
    {label: "Join Game", fxn: joinGame}
  ])

  useEffect(()=>{
    return () => {
      bridgeClient.close()
    }
  },[bridgeClient])

  return (
    <div id="bridge-game-container">
      <BridgeToolbar toolbars={toolbars}/>
      <BridgeNotifications notif={notif}/>
      <BridgePrompt prompt={prompt?.prompt} onKeyDown={prompt?.onKeyDown}/>
      <BridgePlayingTable bridgeClient={bridgeClient} game={game} />
    </div>
  )
}

export default Bridge