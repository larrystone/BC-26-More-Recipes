import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'

/**
 * Header component
 * 
 * @export
 * @class Header
 * @extends {Component}
 */
class Header extends Component {
  renderHomeHeader = () => (
    <header>
      <div className="nav-item brand-logo">
        More-Recipes
      </div>
      <div className="nav-item">
        <Button basic>
          SignIn
        </Button>
      </div>
      <div className="nav-item">
        <Button basic>
          SignUp
        </Button>
      </div>
    </header>
  )

  render() {
    return this.renderHomeHeader();
  }
}

export default Header;