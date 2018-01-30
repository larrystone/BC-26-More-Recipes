import React, { PureComponent } from 'react';
import jsonwebtoken from 'jsonwebtoken';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signOut } from '../actions/authActions';

/**
 * @description authentication class for protected routes
 *
 * @class ValidateUser
 *
 * @param  {object} ChildComponent the child component to be rendered
 *
 */
export default function ValidateUser(ChildComponent) {
  /**
   * @class AuthenticateUser
   *
   * @classdesc authenticate user component
   *
   */
  class Authenticate extends PureComponent {
    /**
     * @description validates the authentication status of user
     *
     * @method componentWillMount
     *
     * @return {void} Null
     *
     */
    componentWillMount() {
      const JWT_SECRET = process.env.JWT_SECRET || '!\'s_aka*@#0';
      const { token } = localStorage;
      if (!token) {
        this.props.signOut();
      } else if (token) {
        jsonwebtoken.verify(token, JWT_SECRET, (error, decoded) => {
          if (error || decoded.exp < (new Date().getTime() / 1000)) {
            this.props.signOut();
          }
        });
      }
    }

    /**
     * @description render - renders the child component
     *
     * @return {object} returns the view object
     *
     */
    render() {
      return (
        <ChildComponent {...this.props} />
      );
    }
  }

  Authenticate.propTypes = {
    signOut: PropTypes.func.isRequired
  };

  return connect(null, { signOut })(Authenticate);
}
