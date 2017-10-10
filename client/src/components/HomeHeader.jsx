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
      <div className="flex-row">
        <div className="brand-logo">
          More-Recipes
      </div>
        <div>
          <Button basic
            onClick={() => {
              this.props.setDialogType('signin')
            }}
          >
            Sign In
        </Button>
        </div>
        <div>
          <Button basic
            onClick={() => {
              this.props.setDialogType('signup');
            }}
          >
            Sign Up
        </Button>
        </div>
      </div>
    </header>
  )

  render() {
    return this.renderHomeHeader();
  }
}

export default connect(null, { setDialogType })(Header);