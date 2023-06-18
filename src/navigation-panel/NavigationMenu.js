import React from "react";

import NavigationMenuItem from "./NavigationMenuItem";

import "./NavigationMenu.css"

import GameIcon from "../assets/images/game-icon.png"
import HomeIcon from  "../assets/images/home-icon.png"

class NavigationMenu extends React.Component {
  state = {
    menuItemIsSelected: {
      home: true,
      writings: false,
      contact: false
    }
  }

  handleClick = event => {
    let selection = {}
    selection[event.currentTarget.id] = true


    this.setState({menuItemIsSelected: selection})
  }

  render(){
    return (
      <div id="navigation-menu-container">
        <NavigationMenuItem
          route="/home"
          id="home"
          selected={this.state.menuItemIsSelected.home}
          handleClick={this.handleClick.bind(this)}
          image={HomeIcon}
        />
        <NavigationMenuItem
          route="/games"
          id="games"
          selected={this.state.menuItemIsSelected.games}
          handleClick={this.handleClick.bind(this)}
          image={GameIcon}
        />
      </div>
    )
  }
}

export default NavigationMenu