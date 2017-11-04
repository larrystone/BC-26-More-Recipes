import React from 'react';
import { Form, Card, Label, Accordion, Icon } from 'semantic-ui-react';
import { Chart } from 'react-google-charts';
import PropTypes from 'prop-types';

const ZERO = 0;

const Profile = ({ actions, loading, activeIndex, username, email, name,
  error, my_recipes, my_favs, my_reviews, chartClicked }) => {
  const renderProfileDetails = () => {
    return (
      <Card centered style={{ width: '550px' }}>
        <Label attached='top'><h3>Basic Information</h3></Label>
        <Card.Content>
          <Form>
            <Form.Input
              disabled={loading}
              label='Full Name'
              placeholder='Enter your full name'
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
              readOnly
              label='Email Address'
              placeholder='Email Address'
              value={email}
            />
            <div className='error'>
              {error}
            </div>
            <Form.Button positive
              disabled={loading}
            >
              {'Update'}
            </Form.Button>
          </Form>

          <Accordion>
            <Accordion.Title
              active={activeIndex === ZERO}
              index={ZERO}
              onClick={actions.handleAccordionClick}>
              <Label style={{ width: '100%' }}>
                <Icon name='dropdown' />
                {'Change Password'}
              </Label>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === ZERO}>
              <Form>
                <Form.Input
                  disabled={loading}
                  label='Enter Old Password'
                  placeholder='Password'
                  type='password'
                  onChange={(event) => {
                    actions.storeToState('password1', event.target.value);
                  }} />
                <Form.Input
                  disabled={loading}
                  label='Enter new Password'
                  placeholder='Password'
                  type='password'
                  onChange={(event) => {
                    actions.storeToState('password1', event.target.value);
                  }} />
                <Form.Input
                  disabled={loading}
                  label='Re-enter new Password'
                  placeholder='Re-enter Password'
                  type='password'
                  onChange={(event) => {
                    actions.storeToState('password2', event.target.value);
                  }} />
                <Form.Button
                  disabled={loading}
                  color='red'
                  onClick={(/* event */) => {
                    // actions.updatePassword(event);
                  }}>
                  {'Change Password'}
                </Form.Button>
              </Form>
            </Accordion.Content>
          </Accordion>
        </Card.Content>
      </Card>
    );
  };

  const renderStats = () => {
    return (
      <Card centered style={{ width: '550px' }}>
        <Label attached='top'><h3>My Stats Chart</h3></Label>
        <Card.Content>
          <Chart
            chartType='PieChart'
            width='100%'
            data={[
              ['Section', 'Count'],
              ['My Recipes', my_recipes],
              ['My Reviews', my_reviews],
              ['My Favorites', my_favs]
            ]}
            options={
              {
                'title': `@${username} Summary`,
                'pieHole': 0.4, 'is3D': true
              }
            }
            chartEvents={chartClicked}
            legend_toggle
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <Card.Group>
      {renderProfileDetails()}
      {renderStats()}
    </Card.Group>
  );
};

Profile.propTypes = {
  loading: PropTypes.bool,
  username: PropTypes.string,
  email: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.string,
  activeIndex: PropTypes.number,
  my_recipes: PropTypes.number,
  my_favs: PropTypes.number,
  my_reviews: PropTypes.number,
  actions: PropTypes.object,
  chartClicked: PropTypes.array
};

export default Profile;