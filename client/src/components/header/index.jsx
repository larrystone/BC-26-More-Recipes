import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import View from './View';

import { signOut } from '../../actions/authActions';

/**
 * @description - Head Container component
 *
 * @class Head
 *
 * @param {string} route - new Route
 *
 * @extends {PureComponent}
 */
export class Head extends PureComponent {
  goToRoute = (route) => {
    this.context.router.history.push(route);
  };

  /**
   * @description - Calls view for component rendering
   *
   * @returns {object} View - Rendered view
   *
   * @memberof Head
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

Head.propTypes = {
  signOut: PropTypes.func.isRequired,
  activePage: PropTypes.string,
  loggedUser: PropTypes.shape().isRequired
};

Head.defaultProps = {
  activePage: ''
};

Head.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { signOut })(Head);
