import React from 'react';
import { Button, Popup, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import efo from './../../../images/efo.jpg';

/**
 * Stateless component for rendering intro banner
 * on landing page
 *
 * @param {object} props
 * @returns {view} AppIntro
 */
const AppIntro = ({ storeToState, handleSignIn, handleSignUp, isLoading }) => (
  <div>
    <div
      className="intro wow bounceInDown"
      style={
        {
          background: `url(${efo}) no-repeat`,
          backgroundSize: '100%',
          width: '100%',
          height: '450px',
          margin: '0px 0px 15px 0px'
        }
      }
    >
      <div
        className="wow bounceInUp"
        style={
          {
            display: 'flex',
            padding: '30px 10px 0px 0px'
          }}
      >
        <Popup
          trigger={
            <Button size="large" style={{ marginLeft: 'auto' }}>
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
          trigger={<Button size="large">{'Sign Up'}</Button>}
          flowing
          on="click"
          position="bottom right"
        >
          <Form style={{ width: '300px' }} loading={isLoading}>
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
                storeToState('password2', event.target.value);
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
        <h1 style={{ fontSize: '40px' }}>{'More-Recipes'}</h1>
        <h2>
          {'. . . your social media for connecting with wonderful delicacies!'}
        </h2>
      </div>
    </div >
  </div >
);

AppIntro.propTypes = {
  storeToState: PropTypes.func.isRequired,
  handleSignIn: PropTypes.func.isRequired,
  handleSignUp: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default AppIntro;
