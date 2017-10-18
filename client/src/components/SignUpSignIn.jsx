import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Modal, Button } from 'semantic-ui-react';
import axios from 'axios';
import { bake_cookie } from 'sfcookies';
import { createBrowserHistory } from 'history';

import { setDialogType } from '../actions/dialog';

const TOKEN = 'more-recipe-token';

import * as validate from '../../../server/middleware/validate';

class SignInSignUp extends Component {
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

  storeToState(key, value) {
    this.setState(
      {
        [key]: value,
        error: ''
      }
    )
  }

  showSignInSignUp = () => {
    const { dialogType } = this.props;
    if (dialogType === 'signup') {
      return this.renderSignUp();
    } else if (dialogType === 'signin') {
      return this.renderSignIn();
    } else if (dialogType === 'reset-password') {
      return this.renderResetPassword();
    } else {
      return (
        <div></div>
      )
    }
  }

  renderSignUp = () => {
    const { loading, name, email, username, password1, password2 } = this.state;
    return (
      <Modal open={true}>
        <Modal.Header>
          Sign Up for an Account
          </Modal.Header>
        <Modal.Content>
          <Form loading={loading}>
            <Form.Input
              disabled={loading}
              label='Enter your name'
              placeholder='Enter your name'
              value={name}
              onChange={(event) => {
                this.storeToState('name', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Username'
              placeholder='Username'
              value={username}
              onChange={(event) => {
                this.storeToState('username', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Email Address'
              placeholder='Email Address'
              value={email}
              onChange={(event) => {
                this.storeToState('email', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Password'
              placeholder='Password'
              type='password'
              value={password1}
              onChange={(event) => {
                this.storeToState('password1', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Re-enter Password'
              placeholder='Re-enter Password'
              type='password'
              value={password2}
              onChange={(event) => {
                this.storeToState('password2', event.target.value)
              }} />
            <div className='error'>
              {this.state.error}
            </div>
            <Form.Button positive
              disabled={loading}
              onClick={(event) => {
                this.handleSignUp(event);
              }}>
              Continue
              </Form.Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          Already have an account?
          <Button disabled={loading}
            onClick={() => {
              this.resetFormFields();
              this.props.setDialogType('signin');
            }}>
            Sign In
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  handleSignUp = (event) => {
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
          { error: 'Password don\'t match' }
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
  }

  resetFormFields = () => {
    this.setState(
      {
        error: '',
        password1: ''
      }
    )
  }

  renderSignIn = () => {
    const { loading, username, password1 } = this.state;
    return (
      <Modal open={true}>
        <Modal.Header>
          Sign In to Your Account
        </Modal.Header>
        <Modal.Content>
          <Form loading={loading}>
            <Form.Input
              disabled={loading}
              icon='user'
              iconPosition='left'
              label='Username or Email'
              placeholder='Username or Email'
              value={username}
              onChange={(event) => {
                this.storeToState('username', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              icon='lock'
              iconPosition='left'
              label='Password'
              value={password1}
              placeholder='Password'
              type='password'
              onChange={(event) => {
                this.storeToState('password1', event.target.value)
              }} />

            <div className='error'>
              {this.state.error}
            </div>
            <Form.Button positive
              disabled={loading}
              onClick={(event) => {
                this.handleSignIn(event);
              }}>
              Sign In
          </Form.Button>
            <a
              onClick={() => {
                this.resetFormFields();
                this.props.setDialogType('reset-password');
              }}
            >Forgot password?</a>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          Don't have an account?
        <Button
            disabled={loading}
            onClick={() => {
              this.resetFormFields();
              this.props.setDialogType('signup');
            }}>
            Sign Up
        </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  handleSignIn = (event) => {
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

  storeToken = (token) => {
    bake_cookie(TOKEN, token);
  }

  redirectToDashboard = () => {
    createBrowserHistory().replace('/dashboard');
    window.location.reload();
  }

  renderResetPassword = () => {
    const { loading, email } = this.state;
    return (
      <Modal open={true}>
        <Modal.Header>
          Reset Your Password
        </Modal.Header>
        <Modal.Content>
          <Form loading={loading}>
            <Form.Input
              disabled={loading}
              icon='mail'
              iconPosition='left'
              label='Email Address'
              placeholder='Enter Email address'
              value={email}
              onChange={(event) => {
                this.storeToState('email', event.target.value)
              }} />
            <span className="error">{this.state.error}</span>
            <Form.Button positive
              disabled={loading}
              onClick={() => {
                this.setState(
                  { error: 'Sorry, feature not yet available!' }
                )
              }}>
              Submit
          </Form.Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          Not what you wanted?
          <Button
            disabled={loading}
            onClick={() => {
              this.setState(
                { error: '' }
              );
              this.props.setDialogType('signup');
            }}>
            Sign Up
          </Button>
          &nbsp; OR
          <Button
            disabled={loading}
            onClick={() => {
              this.setState(
                { error: '' }
              );
              this.props.setDialogType('signin');
            }}>
            Sign In
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render() {
    return (
      <div>
        {this.showSignInSignUp()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dialogType: state.dialog
  }
}

export default connect(mapStateToProps, { setDialogType })(SignInSignUp);