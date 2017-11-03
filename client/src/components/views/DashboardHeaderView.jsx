import React from 'react';
import { Button, Icon, Label, Menu, Popup } from 'semantic-ui-react';
import { bake_cookie } from 'sfcookies';
import PropTypes from 'prop-types';

const TOKEN = 'more-recipe-token';

const DashboardHeaderView = ({ setDashboardSection,
  loggedUser, dashboardSection }) => {
  const handleSignOut = () => {
    bake_cookie(TOKEN, null);
    window.location.reload();
  };

  const isActive = (section) => {
    return section === dashboardSection ? true : false;
  };

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
                {loggedUser.username}
                <Icon name='caret down' />
              </div>}
            on='click'
            hideOnScroll
          >
            <Menu vertical
              style={{ width: '100px' }}>
              <Menu.Item
                onClick={() => { setDashboardSection('profile'); }}
              >
                My Profile
                </Menu.Item>
              <Menu.Item
                onClick={() => { handleSignOut(); }}
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
            onClick={() => { setDashboardSection('home'); }}
            active={isActive('home')}
            disabled={isActive('home')}
          >Home</Button>
          <Button basic
            onClick={() => { setDashboardSection('my_recipes'); }}
            active={isActive('my_recipes')}
            disabled={isActive('my_recipes')}
          >My Recipes</Button>
          <Button basic
            onClick={() => { setDashboardSection('my_favs'); }}
            active={isActive('my_fav')}
            disabled={isActive('my_favs')}
          >My Favorites</Button>
        </Button.Group>
      </div>
    </header>
  );
};

DashboardHeaderView.propTypes = {
  loggedUser: PropTypes.object,
  dashboardSection: PropTypes.string,
  setDashboardSection: PropTypes.func
};

export default DashboardHeaderView;
