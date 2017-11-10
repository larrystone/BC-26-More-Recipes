import React, { Component } from 'react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import PropTypes from 'prop-types';

import ProfileView from '../views/ProfileView';

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
              props.actions.setDashboardSection('my_recipes');
            } else if (selectedItem === TWO) {
              props.actions.setDashboardSection('my_favs');
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
      url: `/api/v1/users/${this.props.loggedUser.id}/profile`,
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
      url: `/api/v1/users/${this.props.loggedUser.id}/recipes`,
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
      url: `/api/v1/users/${this.props.loggedUser.id}/reviews`,
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

  storeToState = (key, value) => {
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

  render() {
    return (
      <ProfileView
        actions={
          {
            storeToState: this.storeToState,
            handleAccordionClick: this.handleAccordionClick
          }
        }
        chartClicked={this.chartClicked}
        loading={this.state.loading}
        activeIndex={this.state.activeIndex}
        email={this.state.email}
        name={this.state.name}
        username={this.state.username}
        error={this.state.error}
        my_recipes={this.state.my_recipes}
        my_favs={this.state.my_favs}
        my_reviews={this.state.my_reviews}
      />
    );
  }
}

Profile.propTypes = {
  loggedUser: PropTypes.object,
  actions: PropTypes.object
};

export default Profile;