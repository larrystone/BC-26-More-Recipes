import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Modal, Button } from 'semantic-ui-react';
import axios from 'axios';
import { bake_cookie } from 'sfcookies';

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
    } else {
      return (
        <div></div>
      )
    }
  }

  renderSignUp = () => {
    const { loading } = this.state;
    return (
      <Modal open={true}>
        <Modal.Header>
          Sign Up for an Account
          </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              disabled={loading}
              label='Enter your name'
              placeholder='Enter your name'
              onChange={(event) => {
                this.storeToState('name', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Username'
              placeholder='Username'
              onChange={(event) => {
                this.storeToState('username', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Email Address'
              placeholder='Email Address'
              onChange={(event) => {
                this.storeToState('email', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Password'
              placeholder='Password'
              type='password'
              onChange={(event) => {
                this.storeToState('password1', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Re-enter Password'
              placeholder='Re-enter Password'
              type='password'
              onChange={(event) => {
                this.storeToState('password2', event.target.value)
              }} />
            <span className="error">{this.state.error}</span>
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
          <Button disabled={loading}>
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
            this.setState(
              { loading: false, error: 'signup success!' }
            );
            this.storeToken(loggedUser.data.user.token);
          })
          .catch((error) => {
            this.setState(
              { loading: false, error: error.response.data.message }
            );
          });
      }
  }

  renderSignIn = () => {
    const { loading } = this.state;
    return (
      <Modal open={true}>
        <Modal.Header>
          Sign In to Your Account
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              disabled={loading}
              icon='user'
              iconPosition='left'
              label='Username or Email'
              placeholder='Username or Email'
              onChange={(event) => {
                this.storeToState('username', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              icon='lock'
              iconPosition='left'
              label='Password'
              placeholder='Password'
              type='password'
              onChange={(event) => {
                this.storeToState('password1', event.target.value)
              }} />
            <span className="error">{this.state.error}</span>
            <h6 className="right-align">Forgot password?</h6>
            <Form.Button positive
              disabled={loading}
              onClick={(event) => {
                this.handleSignIn(event);
              }}>
              Sign In
          </Form.Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          Don't have an account?
        <Button
            disabled={loading}>
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
        this.setState(
          { loading: false, error: 'signin success!' }
        );
        this.storeToken(loggedUser.data.user.token);
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

export default connect(mapStateToProps, null)(SignInSignUp);