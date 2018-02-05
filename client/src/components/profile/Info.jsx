import React from 'react';
import { Form, Card, Label, Accordion, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import avatar from '../../../images/avatar.png';

const ZERO = 0;

/**
 * @description - Stateless component for viewing
 * and editing user profile details
 *
 * @param {object} props - Component's props
 *
 * @returns {view} ProfileView - Rendered view
 */
function ProfileView({
  actions, loading, activeIndex,
  profile: {
    username, email, name, previewImage
  }, isAdmin
}) {
  /**
   * @description Renders the profile details
   *
   * @returns {view} View - Profile details
   */
  const renderProfileDetails = () => (
    <Card.Content>
      <label
        htmlFor="file-chooser"
        className="clickable flex pad__10"
      >
        <img
          alt=""
          width="250px"
          height="250px"
          src={previewImage || avatar}
          className="profile--img"
        />
      </label>
      <Form.Input
        disabled={!isAdmin}
        id="file-chooser"
        className="hide"
        name="imageUrl"
        type="file"
        accept="image/*"
        onChange={(event) => {
          actions.handleImageChange(event);
        }}
      />
      <Form loading={loading}>
        <Form.Input
          name="name"
          readOnly={!isAdmin}
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={(event) => {
            actions.storeToState('name', event.target.value);
          }}
        />
        <Form.Input
          name="username"
          readOnly={!isAdmin}
          label="Username"
          placeholder="Username"
          value={username}
          onChange={(event) => {
            actions.storeToState('username', event.target.value);
          }}
        />
        <Form.Input
          name="email"
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
          <Label className="full-width">
            <Icon name="dropdown" />
            {'Change Password'}
          </Label>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === ZERO}>
          <Form loading={loading}>
            <Form.Input
              name="currentPassword"
              readOnly={!isAdmin}
              label="Enter Current Password"
              placeholder="Password"
              type="password"
              onChange={(event) => {
                actions.storeToState('oldPassword', event.target.value);
              }}
            />
            <Form.Input
              name="password"
              readOnly={!isAdmin}
              label="Enter new Password"
              placeholder="Password"
              type="password"
              onChange={(event) => {
                actions.storeToState('newPassword', event.target.value);
              }}
            />
            <Form.Input
              name="confirmPassword"
              readOnly={!isAdmin}
              label="Re-enter new Password"
              placeholder="Re-enter Password"
              type="password"
              onChange={(event) => {
                actions.storeToState('confirmPassword', event.target.value);
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
    <Card className="card--profile">
      <Label attached="top"><h3>Basic Information</h3></Label>
      {renderProfileDetails()}
    </Card>
  );
}

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
