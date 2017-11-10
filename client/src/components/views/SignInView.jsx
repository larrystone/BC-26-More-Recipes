import React from 'react';
import { Form, Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const SignInView = ({ userInfo, error, actions, handleSignIn }) => {
  const { loading, username, password1 } = userInfo;
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
              actions.storeToState('username', event.target.value);
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
              actions.storeToState('password1', event.target.value);
            }} />

          <div className='error'>
            {error}
          </div>
          <Form.Button positive
            disabled={loading}
            onClick={() => {
              handleSignIn();
            }}>
            Sign In
        </Form.Button>
          <a
            onClick={() => {
              actions.resetFormFields();
              actions.setDialogType('reset-password');
            }}
          >Forgot password?</a>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        Don't have an account?
      <Button
          disabled={loading}
          onClick={() => {
            actions.resetFormFields();
            actions.setDialogType('signup');
          }}>
          Sign Up
      </Button>
      </Modal.Actions>
    </Modal>
  );
};

SignInView.propTypes = {
  userInfo: PropTypes.object,
  actions: PropTypes.object,
  error: PropTypes.string,
  handleSignIn: PropTypes.func
};

export default SignInView;