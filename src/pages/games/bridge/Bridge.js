import React, { useRef, useState, useEffect } from "react"

import "./Bridge.css"
import { BridgeClient } from "./client/BridgeClient"
import { BridgeCommands } from "./messaging/BridgeCommands"
import { BridgeNotifications, getPlayerActionNotif } from "./utilities/BridgeNotifications"

import { BridgePrompt, BridgePrompts } from "./utilities/BridgePrompt"
import { BridgeToolbar } from "./utilities/BridgeToolbar"
import { BridgePlayingTable } from "./utilities/BridgePlayingTable"
import { BridgePhases } from "./BridgePhases"
import { BridgePlayerActions } from "./messaging/BridgePlayerActions"

function Bridge(props) {
  const [notif, setNotif] = useState()
  const [prompt, setPrompt] = useState()
  const WS_URL = 'ws://localhost:8000'
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

  const startGame = () => {
    setPrompt()
    setDisappearingNotif("The game has started")
    bridgeClient.voteStartGame(stateRef.game.id, stateRef.game.localPlayerId)
  }

  const resetToLanding = () => {
    setPrompt()
    setGame({})
    setNotif()
    setToolBars([
      {label: "New Game", fxn: newGame},
      {label: "Join Game", fxn: joinGame}
    ])
  }

  const getPromptCallbackFunctions = (prompt) => {
    switch(prompt){
      case BridgePrompts.START_GAME:
        return {
          onClick: startGame
        }
      default:
        return {}
    }
  }

  const executeUpdateEffects = (playerAction, actionData) => {
    switch(playerAction){
      case BridgePlayerActions.LEAVE_GAME:
        setPrompt()
        if(actionData.endGame){
          resetToLanding()
        }
        break
      default:
        break
    }
  }

  //----------------------------------CLIENT AND CALLBACKS---------------------------
  const clientCallBack = (msg) => {
    let commandData = msg.commandData

    switch(msg.command){
      case BridgeCommands.UPDATE_GAME:
        setGame({...stateRef.game, ...commandData.game})
        break
      default:
        console.log(msg)
        break
    }
  }

  const [bridgeClient] = useState(new BridgeClient(WS_URL, clientCallBack))

  //---------------------------------PLAYER ACTIONS---------------------------------
  const endGame = () => {
    bridgeClient.leaveGame(stateRef.game.id, stateRef.game.localPlayerId)
    resetToLanding()
  }

  const newGame = () => {
    let localPlayerId = Math.floor(Math.random() * 1000000)
    setGame({localPlayerId: localPlayerId})
    bridgeClient.createNewGame(localPlayerId)
  }

  const joinGame = () => {
    if(!bridgeClient?.connected){
      setPrompt({
        promps: BridgePrompts.SERVER_DOWN
      })
      return
    }

    setGame({})
    setPrompt({
      prompt: BridgePrompts.ENTER_GAME_CODE,
      onKeyDown: inputGameCodeKeyDown
    })
  }

  const [toolbars, setToolBars] = useState([
    {label: "New Game", fxn: newGame},
    {label: "Join Game", fxn: joinGame}
  ])

  useEffect(()=>{
    return () => {
      bridgeClient.leaveGame(stateRef.game.id, stateRef.game.localPlayerId)
      bridgeClient.close()
    }
  }, [])

  console.log(game)

  return (
    <div id="bridge-game-container">
      <BridgeToolbar toolbars={toolbars}/>
      <BridgeNotifications notif={notif}/>
      <BridgePrompt prompt={prompt?.prompt} onClick={prompt?.onClick} onKeyDown={prompt?.onKeyDown}/>
      <BridgePlayingTable bridgeClient={bridgeClient} game={game} />
    </div>
  )
}

export default Bridge