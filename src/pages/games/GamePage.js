import React from "react"

import "../Page.css"
import Bridge from "./bridge/Bridge"
import "./GamePage.css"

class GamePage extends React.Component{
  state = {
    toolbars: []
  }

  setToolbars(toolbars){
    let toolbarButtons = toolbars.map((toolbar)=>{
      return <button onClick={toolbar.fxn} key={Math.random()}>{toolbar.label}</button>
    })
    this.setState({toolbars: toolbarButtons})
  }

  render(){
    return (
    <div className="page-container">
      <div className="header">
        Bridge
        <div className="toolbars">{this.state.toolbars}</div>
      </div>
      <Bridge setToolbars={this.setToolbars.bind(this)}/>
    </div>
    )
  }
}

export default GamePage