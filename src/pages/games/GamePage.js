import React from "react"

import "../Page.css"
import Bridge from "./bridge/Bridge"

class GamePage extends React.Component{
  render(){
    return (
    <div className="page-container">
      <span className="header">Bridge</span>
      <Bridge />
    </div>
    )
  }
}

export default GamePage