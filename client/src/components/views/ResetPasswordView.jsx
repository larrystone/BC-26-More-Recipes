import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ResetPasswordView = ({ userInfo, error, actions }) => {
  const { loading, email } = userInfo;
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
              actions.storeToState('email', event.target.value);
            }} />
          <span className="error">{error}</span>
          <Form.Button positive
            disabled={loading}
            onClick={() => {
              actions.storeToState('error',
                'Sorry, feature not yet available!');
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
            actions.storeToState('error', '');
            actions.setDialogType('signup');
          }}>
          Sign Up
        </Button>
        &nbsp; OR
        <Button
          disabled={loading}
          onClick={() => {
            actions.storeToState('error', '');
            actions.setDialogType('signin');
          }}>
          Sign In
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

ResetPasswordView.propTypes = {
  userInfo: PropTypes.object,
  actions: PropTypes.object,
  error: PropTypes.string
};

export default ResetPasswordView;