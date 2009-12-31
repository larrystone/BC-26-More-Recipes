import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setDialogType } from '../actions/dialog';

/**
 * Home Header component
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
        <Button basic
          onClick={() => {
            this.props.setDialogType('signin')
          }}
        >
          SignIn
        </Button>
      </div>
      <div className="nav-item">
        <Button basic
          onClick={() => {
            this.props.setDialogType('signup');
          }}
        >
          SignUp
        </Button>
      </div>
    </header>
  )

  render() {
    return this.renderHomeHeader();
  }
}

export default connect(null, { setDialogType })(Header);