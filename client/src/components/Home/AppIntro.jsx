import React from 'react';
import { Button, Popup, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import efo from './../../../images/efo.jpg';

/**
 * @description - Stateless component for rendering intro banner
 * on landing page
 *
 * @param {object} props - Component's props
 *
 * @returns {view} AppIntro - Rendered view
 */
function AppIntro({
  storeToState, handleSignIn, handleSignUp, isLoading
}) {
  return (
    <div>
      <div
        className="intro wow bounceInDown banner--image"
        style={
          {
            background: `url(${efo}) no-repeat`
          }
        }
      >
        <div
          className="wow bounceInUp flex button--auth"
        >
          <Popup
            trigger={
              <Button size="large" className="auto__left">
                {'Sign In'}
              </Button>
            }
            flowing
            on="click"
            position="bottom center"
          >
            <Form loading={isLoading} >
              <Form.Input
                icon="user"
                iconPosition="left"
                label="Username or Email"
                placeholder="Username or Email"
                onChange={(event) => {
                  storeToState('authName', event.target.value);
                }}
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                label="Password"
                placeholder="Password"
                type="password"
                onChange={(event) => {
                  storeToState('password', event.target.value);
                }}
              />
              <Form.Button
                fluid
                positive
                onClick={() => {
                  handleSignIn();
                }}
              >
                {'Sign In'}
              </Form.Button>
            </Form>
          </Popup>

          <Popup
            trigger={<Button size="large">Sign Up</Button>}
            flowing
            on="click"
            position="bottom right"
          >
            <Form className="form--signup" loading={isLoading}>
              <Form.Input
                label="Enter your full name"
                placeholder="Full name"
                onChange={(event) => {
                  storeToState('name', event.target.value);
                }}
              />
              <Form.Input
                label="Pick a username"
                placeholder="Username"
                onChange={(event) => {
                  storeToState('username', event.target.value);
                }}
              />
              <Form.Input
                label="Enter email address"
                placeholder="Email Address"
                onChange={(event) => {
                  storeToState('email', event.target.value);
                }}
              />
              <Form.Input
                label="Enter Password"
                placeholder="Password"
                type="password"
                onChange={(event) => {
                  storeToState('password', event.target.value);
                }}
              />
              <Form.Input
                label="Re-enter Password"
                placeholder="Re-enter Password"
                type="password"
                onChange={(event) => {
                  storeToState('confirmPassword', event.target.value);
                }}
              />
              <Form.Button
                fluid
                positive
                onClick={() => {
                  handleSignUp();
                }}
              >
                {'Sign Up'}
              </Form.Button>
            </Form>
          </Popup>
        </div>
        <div id="title" className="wow infinite pulse">
          <h1 className="text--heading">More-Recipes</h1>
          <h2>
            . . . your social media for connecting with wonderful delicacies!
          </h2>
        </div>
      </div >
    </div >
  );
}

AppIntro.propTypes = {
  storeToState: PropTypes.func.isRequired,
  handleSignIn: PropTypes.func.isRequired,
  handleSignUp: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default AppIntro;
