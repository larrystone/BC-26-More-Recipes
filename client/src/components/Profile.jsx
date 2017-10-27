import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Card, Label, Accordion, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import { Chart } from 'react-google-charts';
import PropTypes from 'prop-types';

import { setDashboardSection } from '../actions/dashboard';

const TOKEN = read_cookie('more-recipe-token');
const ZERO = 0, TWO = 2, NULL_INDEX = -1;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.chartClicked = [
      {
        eventName: 'select',
        callback(Chart) {
          const selection = Chart.chart.getSelection();
          if (selection.length !== ZERO) {
            const selectedItem = selection[ZERO].row;
            if (selectedItem === ZERO) {
              props.setDashboardSection('my_recipes');
            } else if (selectedItem === TWO) {
              props.setDashboardSection('my_favs');
            }
          }
        }
      }
    ];

    this.state = {
      name: '',
      username: '',
      email: '',
      password1: '',
      password2: '',
      error: '',
      loading: false,
      activeIndex: NULL_INDEX,
      my_favs: ZERO,
      my_recipes: ZERO,
      my_reviews: ZERO
    };
  }

  fetchDetails() {
    this.setState({
      loading: true
    });
    axios({
      method: 'GET',
      url: `/api/v1/users/${this.props.loggedUserId}/profile`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const { username, email, name } = response.data.user;
        this.setState(
          {
            username,
            email,
            name,
            loading: false
          }
        );
      })
      .catch(() => {
        this.setState(
          { loading: false }
        );
      });
  }

  fetchFavs() {
    axios({
      method: 'GET',
      url: `/api/v1/users/${this.props.loggedUserId}/recipes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            my_favs: response.data.recipe.length
          }
        );
      })
      .catch(() => {
      });
  }

  fetchReviews() {
    axios({
      method: 'GET',
      url: `/api/v1/users/${this.props.loggedUserId}/reviews`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            my_reviews: response.data.recipe.length
          }
        );
      })
      .catch(() => {
      });
  }

  fetchMyRecipes() {
    axios({
      method: 'GET',
      url: '/api/v1/users/myRecipes',
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            my_recipes: response.data.recipe.length
          }
        );
      })
      .catch(() => {
      });
  }

  componentDidMount() {
    this.fetchDetails();
    this.fetchFavs();
    this.fetchReviews();
    this.fetchMyRecipes();
  }

  storeToState(key, value) {
    this.setState(
      {
        [key]: value,
        error: ''
      }
    );
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? NULL_INDEX : index;

    this.setState({ activeIndex: newIndex });
  }

  renderProfileDetails() {
    const { loading, activeIndex, username, email, name } = this.state;
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
                this.storeToState('name', event.target.value);
              }} />
            <Form.Input
              disabled={loading}
              label='Username'
              placeholder='Username'
              value={username}
              onChange={(event) => {
                this.storeToState('username', event.target.value);
              }} />
            <Form.Input
              readOnly
              label='Email Address'
              placeholder='Email Address'
              value={email}
            />
            <div className='error'>
              {this.state.error}
            </div>
            <Form.Button positive
              disabled={loading}
              onClick={() => {
                this.setState({
                  error: 'Sorry, this feature is not available yet'
                });
              }}
            >
              Update
          </Form.Button>
          </Form>

          <Accordion>
            <Accordion.Title
              active={activeIndex === ZERO}
              index={ZERO}
              onClick={this.handleAccordionClick}>
              <Label style={{ width: '100%' }}>
                <Icon name='dropdown' />
                Change Password
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
                    this.storeToState('password1', event.target.value);
                  }} />
                <Form.Input
                  disabled={loading}
                  label='Enter new Password'
                  placeholder='Password'
                  type='password'
                  onChange={(event) => {
                    this.storeToState('password1', event.target.value);
                  }} />
                <Form.Input
                  disabled={loading}
                  label='Re-enter new Password'
                  placeholder='Re-enter Password'
                  type='password'
                  onChange={(event) => {
                    this.storeToState('password2', event.target.value);
                  }} />

                <Form.Button
                  disabled={loading}
                  color='red'
                  onClick={(event) => {
                    this.updatePassword(event);
                  }}>
                  Change Password
              </Form.Button>
              </Form>
            </Accordion.Content>
          </Accordion>
        </Card.Content>
      </Card>
    );
  }

  renderStats() {
    const { my_recipes, my_favs, my_reviews } = this.state;
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
                'title': `@${this.state.username} Summary`,
                'pieHole': 0.4, 'is3D': true
              }
            }
            chartEvents={this.chartClicked}
            legend_toggle
          />
        </Card.Content>
      </Card>
    );
  }

  render() {
    return (
      <Card.Group>
        {this.renderProfileDetails()}
        {this.renderStats()}
      </Card.Group>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedUserId: state.user.id
  };
};

Profile.propTypes = {
  setDashboardSection: PropTypes.func,
  loggedUserId: PropTypes.number
};

export default connect(mapStateToProps, { setDashboardSection })(Profile);