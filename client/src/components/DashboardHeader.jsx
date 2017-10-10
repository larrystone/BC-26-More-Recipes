import React, { Component } from 'react';
import { Button, Icon, Label, Dropdown } from 'semantic-ui-react';
import { bake_cookie } from 'sfcookies';
import { connect } from 'react-redux';

import { logUser } from '../actions/user';
import { setDashboardSection } from '../actions/dashboard';
import { setDialogType } from '../actions/dialog';

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

  isActive(section) {
    const active = this.props.dashboardSection;

    return section === active ? true : false;
  }

  setDashboardSection(newSection) {
    this.props.setDashboardSection(newSection);
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
            <Dropdown pointing='right' text={this.props.loggedUser.username}>
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
              onClick={() => { this.setDashboardSection('home') }}
              active={this.isActive('home')}
              disabled={this.isActive('home')}
            >Home</Button>
            <Button basic
              onClick={() => { this.setDashboardSection('my_recipes') }}
              active={this.isActive('my_recipes')}
              disabled={this.isActive('my_recipes')}
            >My Recipes</Button>
            <Button basic
              onClick={() => { this.setDashboardSection('my_favs') }}
              active={this.isActive('my_fav')}
              disabled={this.isActive('my_favs')}
            >My Favs</Button>
          </Button.Group>
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedUser: state.user,
    dashboardSection: state.dashboard
  }
}

const actionCreators = {
  logUser,
  setDashboardSection,
  setDialogType
}

export default connect(mapStateToProps, actionCreators)(Header);
