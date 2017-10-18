import React, { Component } from 'react';
import { Button, Icon, Label, Menu, Popup } from 'semantic-ui-react';
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
              <Icon name='alarm outline' />
              <Label.Detail>0</Label.Detail>
            </Label>
          </div>
          <div className="flex-item">

            <Popup
              style={{ padding: '0px' }}
              trigger={
                <div className='clickable'>
                  {this.props.loggedUser.username}
                  <Icon name='caret down' />
                </div>}
              on='click'
              hideOnScroll
            >
              <Menu vertical
                style={{ width: '100px' }}>
                <Menu.Item
                  onClick={() => { this.setDashboardSection('profile') }}
                >
                  My Profile
                </Menu.Item>
                <Menu.Item
                  onClick={() => { this.handleSignOut() }}
                >
                  Sign Out
                </Menu.Item>
              </Menu>
            </Popup>
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
            >My Favorites</Button>
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
