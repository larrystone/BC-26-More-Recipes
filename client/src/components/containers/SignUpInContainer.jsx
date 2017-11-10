import React, { PureComponent } from 'react';
import axios from 'axios';
import { bake_cookie } from 'sfcookies';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';

import SignUpView from '../views/SignUpView';
import SignInView from '../views/SignInView';
import ResetPasswordView from '../views/ResetPasswordView';

import * as validate from '../../../../server/middleware/validate';

const TOKEN = 'more-recipe-token';

class SignUpInContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      email: '',
      password1: '',
      password2: '',
      error: '',
      loading: false
    };
  }

  resetFormFields = () => {
    this.setState(
      {
        error: '',
        password1: ''
      }
    );
  };

  storeToState = (key, value) => {
    this.setState(
      {
        error: '',
        [key]: value
      }
    );
  };

  commonActions = {
    resetFormFields: this.resetFormFields,
    setDialogType: this.props.setDialogType,
    storeToState: this.storeToState
  };

  showSignInSignUp() {
    const {
      loading, name,
      email, username, password1,
      password2, error
    } = this.state;
    const { dialogType } = this.props;
    if (dialogType === 'signup') {
      return (
        <SignUpView
          error={error}
          userInfo={
            { loading, name, email, username, password1, password2 }
          }
          actions={this.commonActions}
          handleSignUp={this.handleSignUp}
        />
      );
    } else if (dialogType === 'signin') {
      return (
        <SignInView
          error={error}
          userInfo={
            { loading, username, password1 }
          }
          actions={this.commonActions}
          handleSignIn={this.handleSignIn}
        />
      );
    } else if (dialogType === 'reset-password') {
      return (
        <ResetPasswordView
          error={error}
          userInfo={
            { loading, email }
          }
          actions={this.commonActions}
        />
      );
    } else {
      return (
        <div></div>
      );
    }
  }

  handleSignUp = () => {
    const { name, username, email, password1, password2 } = this.state;

    const error = validate.validateSignUp(
      name, username, email, password1
    );

    if (error) {
      this.setState(
        { error }
      );
    } else
      if (password1 !== password2) {
        this.setState(
          { error: 'Passwords don\'t match' }
        );
      } else {
        this.setState(
          { loading: true }
        );
        axios.post('/api/v1/users/signup', {
          name, username, email, password: password1
        })
          .then((loggedUser) => {
            this.storeToken(loggedUser.data.user.token);
            this.redirectToDashboard();
          })
          .catch((error) => {
            this.setState(
              { loading: false, error: error.response.data.message }
            );
          });
      }
  };

  handleSignIn = () => {
    this.setState(
      { loading: true }
    );
    const { username, password1 } = this.state;
    axios.post('/api/v1/users/signin', {
      username, password: password1
    })
      .then((loggedUser) => {
        this.storeToken(loggedUser.data.user.token);
        this.redirectToDashboard();
      })
      .catch((error) => {
        this.setState(
          { loading: false, error: error.response.data.message }
        );
      });
  }

  storeToken(token) {
    bake_cookie(TOKEN, token);
  }

  redirectToDashboard() {
    createBrowserHistory().replace('/dashboard');
    window.location.reload();
  }

  render() {
    return (
      <div>
        {this.showSignInSignUp()}
      </div>
    );
  }
}

SignUpInContainer.propTypes = {
  setDialogType: PropTypes.func,
  dialogType: PropTypes.string
};

export default SignUpInContainer;