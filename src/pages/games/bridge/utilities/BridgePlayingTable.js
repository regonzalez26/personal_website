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
  game?.players?.forEach((player)=>{
    if(player.id === game.localPlayerId){
      arrangement.unshift(player)
    } else {
      arrangement.push(player)
    }
  })

  console.log("arrangement")
  console.log(arrangement)

  return (
    <div id="bridge-playing-table">
      {
        arrangement.map((player, index) => {
            return (
              <div key={Math.random()} className={`hands-container-${index}`}>
                <Player
                  key={Math.random()}
                  bridgeClient={bridgeClient}
                  playerId={player.id}
                  phase={game.phase}
                  hand={<Hand cards={player.hand}/>}
                  isLocalPlayer={index === 0}
                  playerIcon = {playerIcons[player.icon]}
                />
              </div>
            )
        })
      }
    </div>
  )

}
