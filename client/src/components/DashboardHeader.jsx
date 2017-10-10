import React, { Component } from 'react';
import { Button, Icon, Label, Dropdown } from 'semantic-ui-react';
import { bake_cookie } from 'sfcookies';

const TOKEN = 'more-recipe-token';

/**
 * Dashboard Header component
 * 
 * @export
 * @class Header
 * @extends {Component}
 */
class Header extends Component {
  handleSignOut = () => {
    bake_cookie(TOKEN, null);
    window.location.reload();
  }

  render() {
    return (
      <header>
        <div className="flex-row">
          <div className="brand-logo">
            More-Recipes
          </div>
          <div className="flex-item">
            <Label as='a' color='teal'>
              <Icon name='alarm outline' /> 0
            </Label>
          </div>
          <div className="flex-item">
            <Dropdown pointing text='John Doe'>
              <Dropdown.Menu>
                <Dropdown.Item text='My Profile'
                />
                <Dropdown.Divider />
                <Dropdown.Item text='Sign Out' onClick={() => { this.handleSignOut() }} />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="flex-row">
          <Button.Group>
            <Button basic
            >Home</Button>
            <Button basic
            >My Recipes</Button>
            <Button basic
            >My Favs</Button>
          </Button.Group>
        </div>
      </header >
    )
  }
}

export default Header;