import React from 'react';
import { Form, Card, Label, Accordion, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import avatar from '../../../images/avatar.png';

const ZERO = 0;

const ProfileView = ({
  actions, loading, activeIndex,
  profile: {
    username, email, name, previewImage
  }, isAdmin
}) => {
  const renderProfileDetails = () => (
    <Card.Content>
      <label
        htmlFor="file-chooser"
        className="clickable"
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <img
          alt=""
          width="250px"
          height="250px"
          src={previewImage || avatar}
          style={{ borderRadius: '50%', boxShadow: '1px 2px 2px 2px gray' }}
        />
      </label>
      <Form.Input
        disabled={!isAdmin}
        id="file-chooser"
        style={{ display: 'none' }}
        name="imageUrl"
        type="file"
        accept="image/*"
        onChange={(event) => {
          actions.handleImageChange(event);
        }}
      />
      <Form loading={loading}>
        <Form.Input
          readOnly={!isAdmin}
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={(event) => {
            actions.storeToState('name', event.target.value);
          }}
        />
        <Form.Input
          readOnly={!isAdmin}
          label="Username"
          placeholder="Username"
          value={username}
          onChange={(event) => {
            actions.storeToState('username', event.target.value);
          }}
        />
        <Form.Input
          readOnly
          label="Email Address"
          placeholder="Email Address"
          value={email}
        />
        <Form.Button
          positive
          disabled={loading || !isAdmin}
          onClick={() => {
            actions.updateProfile();
          }}
        >
          {'Update'}
        </Form.Button>
      </Form>

      <Accordion>
        <Accordion.Title
          active={activeIndex === ZERO}
          index={ZERO}
          onClick={actions.handleAccordionClick}
        >
          <Label style={{ width: '100%' }}>
            <Icon name="dropdown" />
            {'Change Password'}
          </Label>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === ZERO}>
          <Form loading={loading}>
            <Form.Input
              readOnly={!isAdmin}
              label="Enter Current Password"
              placeholder="Password"
              type="password"
              onChange={(event) => {
                actions.storeToState('oldPassword', event.target.value);
              }}
            />
            <Form.Input
              readOnly={!isAdmin}
              label="Enter new Password"
              placeholder="Password"
              type="password"
              onChange={(event) => {
                actions.storeToState('newPassword', event.target.value);
              }}
            />
            <Form.Input
              readOnly={!isAdmin}
              label="Re-enter new Password"
              placeholder="Re-enter Password"
              type="password"
              onChange={(event) => {
                actions.storeToState('newPassword2', event.target.value);
              }}
            />
            <Form.Button
              disabled={loading || !isAdmin}
              color="red"
              onClick={() => {
                actions.changePassword();
              }}
            >
              {'Change Password'}
            </Form.Button>
          </Form>
        </Accordion.Content>
      </Accordion>
    </Card.Content>
  );

  return (
    <Card style={{ width: '550px' }}>
      <Label attached="top"><h3>Basic Information</h3></Label>
      {renderProfileDetails()}
    </Card>
  );
};

ProfileView.propTypes = {
  profile: PropTypes.shape().isRequired,
  isAdmin: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  activeIndex: PropTypes.number,
  actions: PropTypes.shape().isRequired
};

ProfileView.defaultProps = {
  activeIndex: -1
};

export default ProfileView;
