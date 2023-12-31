import React from "react";

import "./NavigationMenuItem.css"
import { Link } from "react-router-dom";

class NavigationMenuItem extends React.Component{
  render(){
    return (
      <div className="navigation-menu-item">
        <Link to={this.props.route}>
          <button
            id={this.props.id}
            className={this.props.selected? "selected" : ""}
            type="text"
            style = {{backgroundImage: `url(${this.props.image})`}}
          />
        </Link>
      </div>
    )
  }
}

export default NavigationMenuItem