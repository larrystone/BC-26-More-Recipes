import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import View from './View';

import { signOut } from '../../actions/authActions';

/**
 * @description - Header Container component
 *
 * @class Header
 *
 * @param {string} route - new Route
 *
 * @extends {PureComponent}
 */
class Header extends PureComponent {
  goToRoute = (route) => {
    this.context.router.history.push(route);
  };

  /**
   * @description - Calls view for component rendering
   *
   * @returns {object} View - Rendered view
   *
   * @memberof Header
   */
  render() {
    return (
      <View
        activePage={this.props.activePage}
        signOut={this.props.signOut}
        loggedUser={this.props.loggedUser}
        goTo={this.goToRoute}
      />
    );
  }
}

/**
 * @description - Maps data from redux state to componenet props
 *
 * @param {object} state - Redux state
 *
 * @returns {object} props - Mapped props
 */
const mapStateToProps = state => ({
  loggedUser: state.auth.user
});

Header.propTypes = {
  signOut: PropTypes.func.isRequired,
  activePage: PropTypes.string,
  loggedUser: PropTypes.shape().isRequired
};

Header.defaultProps = {
  activePage: ''
};

Header.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { signOut })(Header);
