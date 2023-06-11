import React from "react";

import NavigationMenuItem from "./NavigationMenuItem";

import "./NavigationMenu.css"

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


    this.setState({
      menuItemIsSelected: selection
    })
  }

  render(){
    return (
      <div id="navigation-menu-container">
        <NavigationMenuItem route="/home" id="home" selected={this.state.menuItemIsSelected.home} handleClick={this.handleClick.bind(this)} label="Home" />
        <NavigationMenuItem route= "/blog" id="writings" selected={this.state.menuItemIsSelected.writings} handleClick={this.handleClick.bind(this)} label="Blog" />
        <NavigationMenuItem route="/contact" id="contact" selected={this.state.menuItemIsSelected.contact} handleClick={this.handleClick.bind(this)} label="Contact" />
      </div>
    )
  }
}

export default NavigationMenu