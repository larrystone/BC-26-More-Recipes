import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * Home Header component
 *
 * @export
 * @class Header
 * @extends {Component}
 */
const Header = (props) => {
  return (
    <header>
      <div className="flex-row">
        <div className="brand-logo">
          More-Recipes
      </div>
        <div>
          <Button basic
            onClick={() => {
              props.setDialogType('signin');
            }}
          >
            Sign In
        </Button>
        </div>
        <div>
          <Button basic
            onClick={() => {
              props.setDialogType('signup');
            }}
          >
            Sign Up
        </Button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  setDialogType: PropTypes.func
};

export default Header;