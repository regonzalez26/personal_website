import React from "react";

import "./NavigationPanel.css"
import displayPicture from "../assets/display-picture.jpg"
import NavigationMenu from "./NavigationMenu";

class NavigationPanel extends React.Component {
  render(){
    return (
      <div id="navigation-panel-container">
        <img id="display-picture" src={displayPicture} alt="Picture of RJ Gonzalez" />
        <NavigationMenu />
      </div>
    );
  }
}

export default NavigationPanel;
