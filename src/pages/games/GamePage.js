import React from "react"

import "../Page.css"
import Bridge from "./bridge/Bridge"
import "./GamePage.css"
import tableBg from "./bridge/assets/velvet-background.png"

function GamePage(props){
  return (
    <div
      className="page-container"
      style={{backgroundImage: `url(${tableBg})`}}
    >
      <div className="header">
        Bridge
      </div>
      <Bridge />
    </div>
  )
}

export default GamePage