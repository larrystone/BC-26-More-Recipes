import React from 'react';
import { Button } from 'semantic-ui-react';
import efo from './../../../images/efo.jpg';

const AppIntro = () => (
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
      <div id="title" className="wow infinite pulse">
        <h1 style={{ fontSize: '40px' }}>More-Recipes</h1>
        <h2>
          . . . your social media for connecting with wonderful delicacies!
        </h2>
      </div>
      <div
        className="wow bounceInUp"
        style={
          {
            display: 'flex',
            justifyContent: 'center',
            padding: '30px 0px'
          }}
      >
        <div>
          <Button
            primary
            style={{ fontSize: '18px', width: '200px' }}
          >
            Join us
          </Button>
        </div>
      </div>

    </div>
  </div>
);

export default AppIntro;
