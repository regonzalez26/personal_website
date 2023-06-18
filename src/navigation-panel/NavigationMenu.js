import React from "react";

import NavigationMenuItem from "./NavigationMenuItem";

import "./NavigationMenu.css"

import GameIcon from "../assets/images/game-icon.png"
import HomeIcon from  "../assets/images/home-icon.png"
import { useLocation } from "react-router-dom";

function NavigationMenu (){
  const location = useLocation()
  
  return (
      <div id="navigation-menu-container">
        <NavigationMenuItem
          route="/home"
          id="home"
          selected={location.pathname === "/home"}
          image={HomeIcon}
        />
        <NavigationMenuItem
          route="/games"
          id="games"
          selected={location.pathname === "/games"}
          image={GameIcon}
        />
      </div>
  )
}

export default NavigationMenu