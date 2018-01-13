import React from 'react';
import { Button, Icon, Label, Menu, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const View = ({
  loggedUser, signOut, activePage, goTo
}) => {
  const isActive = link => link === activePage;
  return (
    <header>
      <div className="flex-row">
        <div className="brand-logo">
          More-Recipes
        </div>
        <div className="flex-item">
          <Popup
            trigger={
              <Label as="a" color="teal" >
                <Icon name="alarm outline" />
                <Label.Detail>0</Label.Detail>
              </Label>}
            on="click"
            hideOnScroll
            position="bottom center"
          >
            No new notifications
          </Popup>
        </div>
        <div className="flex-item">
          <Popup
            style={{ padding: '0px' }}
            trigger={
              <div className="clickable">
                {loggedUser.username}
                <Icon name="caret down" />
              </div>}
            on="click"
            hideOnScroll
          >
            <Menu
              vertical
              style={{ width: '100px' }}
            >
              <Menu.Item
                onClick={() => {
                  goTo(`/profile/${loggedUser.id}`);
                }}
              >
                My Profile
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  signOut();
                  window.location.href = '/';
                }}
              >
                Sign Out
              </Menu.Item>
            </Menu>
          </Popup>
        </div>
      </div>
      <div className="flex-row">
        <Button.Group>
          <Button
            basic
            onClick={() => {
              goTo('/recipes/?page=1&limit=10');
            }}
            active={isActive('home')}
            disabled={isActive('home')}
          >
            Home
          </Button>
          <Button
            basic
            onClick={() => {
              goTo('/myrecipes');
            }}
            active={isActive('myrecipes')}
            disabled={isActive('myrecipes')}
          >
            My Recipes
          </Button>
          <Button
            basic
            onClick={() => {
              goTo('/favorites');
            }}
            active={isActive('myfav')}
            disabled={isActive('myfav')}
          >
            My Favorites
          </Button>
        </Button.Group>
      </div>
    </header>
  );
};

View.propTypes = {
  loggedUser: PropTypes.shape().isRequired,
  activePage: PropTypes.string,
  signOut: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired
};

View.defaultProps = {
  activePage: ''
};

export default View;
