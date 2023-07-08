import { BridgePlayerActions } from "../messaging/BridgePlayerActions"

export const getPlayerActionNotif = (action, actionData) => {
  let notif

  switch(action){
    case BridgePlayerActions.JOIN_GAME:
      notif = <div>PLAYER {actionData.playerInfo.id} has joined the game.<br></br>Waiting for others...</div>
      break
    case BridgePlayerActions.VOTE_START_GAME:
      notif = <div>PLAYER {actionData.playerInfo.id} has voted to start the game</div>
      break
    case BridgePlayerActions.LEAVE_GAME:
      notif = <div> PLAYER {actionData.playerInfo.id} has left the game</div>
      break
    default:
      notif = "A player action has been done"
      break
  }

  return notif
}

export function BridgeNotifications(props){
  return (
    <div id="bridge-game-notif-bar">
      {props.notif}
    </div>
  )
}