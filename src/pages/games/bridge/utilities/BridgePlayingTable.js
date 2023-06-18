import Hand from "../components/Hand"
import Player from "../player/Player"

import playerIcon1 from "../assets/remote-player-icon-0.jpg"
import playerIcon2 from "../assets/remote-player-icon-1.jpg"
import playerIcon3 from "../assets/remote-player-icon-2.jpg"
import playerIcon4 from "../assets/remote-player-icon-3.jpg"

export function BridgePlayingTable(props){
  let game = props.game
  let bridgeClient = props.bridgeClient

  const playerIcons = [
    playerIcon1,
    playerIcon2,
    playerIcon3,
    playerIcon4
  ]

  const arrangement = []
  game?.hands?.forEach((hand)=>{
    if(hand.playerId === game.localPlayerId){
      arrangement.unshift(hand)
    } else {
      arrangement.push(hand)
    }
  })

  return (
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
                />
              </div>
            )
        })
      }
    </div>
  )

}
