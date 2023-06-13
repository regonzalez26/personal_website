import React from "react"
import "./PlayingTable.css"

function PlayingTable(props) {

  return (
    <div
      id="playing-table-container"
    >
      <div id="playing-table-notification-bar">
        {props.notif}
      </div>
    </div>
  )
}

export default PlayingTable