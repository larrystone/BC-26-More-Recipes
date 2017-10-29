import React from 'react';
import { Form, Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const SignUpView = ({ userInfo, error, actions, handleSignUp }) => {
  const { loading, name, email, username, password1, password2 } = userInfo;
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
              actions.storeToState('name', event.target.value);
            }} />
          <Form.Input
            disabled={loading}
            label='Username'
            placeholder='Username'
            value={username}
            onChange={(event) => {
              actions.storeToState('username', event.target.value);
            }} />
          <Form.Input
            disabled={loading}
            label='Email Address'
            placeholder='Email Address'
            value={email}
            onChange={(event) => {
              actions.storeToState('email', event.target.value);
            }} />
          <Form.Input
            disabled={loading}
            label='Password'
            placeholder='Password'
            type='password'
            value={password1}
            onChange={(event) => {
              actions.storeToState('password1', event.target.value);
            }} />
          <Form.Input
            disabled={loading}
            label='Re-enter Password'
            placeholder='Re-enter Password'
            type='password'
            value={password2}
            onChange={(event) => {
              actions.storeToState('password2', event.target.value);
            }} />
          <div className='error'>
            {error}
          </div>
          <Form.Button positive
            disabled={loading}
            onClick={() => {
              handleSignUp();
            }}>
            Continue
                </Form.Button>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        Already have an account?
            <Button disabled={loading}
          onClick={() => {
            actions.resetFormFields();
            actions.setDialogType('signin');
          }}>
          Sign In
            </Button>
      </Modal.Actions>
    </Modal>
  );
};

SignUpView.propTypes = {
  userInfo: PropTypes.object,
  actions: PropTypes.object,
  error: PropTypes.string,
  handleSignUp: PropTypes.func
};

export default SignUpView;