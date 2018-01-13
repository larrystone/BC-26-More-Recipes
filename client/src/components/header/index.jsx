import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import View from './view';

import { signOut } from '../../actions/authActions';

/**
 * Header Container component
 *
 * @class Header
 * @param {string} route
 * @extends {PureComponent}
 */
class Header extends PureComponent {
  goToRoute = (route) => {
    this.context.router.history.push(route);
  };

  /**
   * Calls view for component rendering
   *
   * @returns {object} View
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
