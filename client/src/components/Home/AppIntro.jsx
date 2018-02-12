import React from 'react';
import { Button, Popup, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import foods from './../../../images/foods.png';
import './../../../images/cake.jpg';

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
        className="intro banner--image"
      >
        <div
          className="wow bounceInUp flex button--auth"
        >
          <Popup
            trigger={
              <Button
                color="brown"
                size="large"
                className="auto__left"
                id="signIn"
              >
                {'Sign In'}
              </Button>
            }
            flowing
            on="click"
            position="bottom center"
          >
            <Form loading={isLoading} >
              <Form.Input
                required
                name="authName"
                icon="user"
                iconPosition="left"
                label="Username or Email"
                placeholder="Username or Email"
                onChange={(event) => {
                  storeToState('authName', event.target.value);
                }}
              />
              <Form.Input
                required
                name="password"
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
                color="brown"
                onClick={() => {
                  handleSignIn();
                }}
              >
                {'Sign In'}
              </Form.Button>
            </Form>
          </Popup>

          <Popup
            trigger={
              <Button color="brown" size="large" id="signUp">Sign Up</Button>
            }
            flowing
            on="click"
            position="bottom right"
          >
            <Form className="form--signup" loading={isLoading}>
              <Form.Input
                required
                name="name"
                label="Enter your full name (Max. 100 characters)"
                placeholder="Full name"
                onChange={(event) => {
                  storeToState('name', event.target.value);
                }}
              />
              <Form.Input
                required
                name="username"
                label="Pick a username (Max. 50 characters)"
                placeholder="Username"
                onChange={(event) => {
                  storeToState('username', event.target.value);
                }}
              />
              <Form.Input
                required
                name="email"
                label="Enter email address (Max. 50 characters)"
                placeholder="Email Address"
                onChange={(event) => {
                  storeToState('email', event.target.value);
                }}
              />
              <Form.Input
                required
                name="password"
                label="Enter Password (Max. 50 characters)"
                placeholder="Password"
                type="password"
                onChange={(event) => {
                  storeToState('password', event.target.value);
                }}
              />
              <Form.Input
                required
                name="confirmPassword"
                label="Re-enter Password"
                placeholder="Re-enter Password"
                type="password"
                onChange={(event) => {
                  storeToState('confirmPassword', event.target.value);
                }}
              />
              <Form.Button
                color="brown"
                fluid
                onClick={() => {
                  handleSignUp();
                }}
              >
                {'Sign Up'}
              </Form.Button>
            </Form>
          </Popup>
        </div>
        <div className="flex flex__wrap">
          <div id="title">
            <span className="text--heading">More-Recipes</span>
            <br /><br />
            <p className="sub-title">
              &nbsp;&nbsp;&nbsp;* Explore our recipe collections
            </p>
            <p className="sub-title">
              &nbsp;&nbsp;&nbsp;* Share your recipe ideas
            </p>
            <p className="sub-title">
              &nbsp;&nbsp;&nbsp;* Review recipes
            </p>
            <p className="sub-title">
              &nbsp;&nbsp;&nbsp;* And lots more...
            </p>
          </div>
          <img
            src={`${foods}`}
            alt=""
            height="500px"
            width="600px"
            className="foods"
          />
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
