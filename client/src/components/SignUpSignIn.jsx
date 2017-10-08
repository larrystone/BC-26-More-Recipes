import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Modal, Button } from 'semantic-ui-react'

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
      status: 'login',
      error: 'error',
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
      // TODO return signIn form
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
        //TODO use axios to connect to backend
      }
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