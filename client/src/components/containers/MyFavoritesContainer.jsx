import React, { Component } from 'react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import PropTypes from 'prop-types';

import MyFavoritesView from '../views/MyFavoritesView';

const TOKEN = read_cookie('more-recipe-token'),
  ZERO = 0,
  NULL_INDEX = -1;

class MyFavorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      my_favs: null,
      activeIndex: ZERO
    };
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? NULL_INDEX : index;

    this.setState({ activeIndex: newIndex });
  }

  fetchRecipes() {
    axios({
      method: 'GET',
      url: `/api/v1/users/${this.props.loggedUser.id}/recipes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            my_favs: response.data.recipe
          }
        );
        this.props.actions.setReloadRecipes(false);
      })
      .catch(() => {
      });
  }

  componentDidMount() {
    this.fetchRecipes();
  }

  render() {
    if (this.props.reloadRecipes) {
      this.fetchRecipes();
    }

    return (
      <MyFavoritesView
        actions={
          {
            ...this.props.actions,
            handleAccordionClick: this.handleAccordionClick
          }
        }
        activeIndex={this.state.activeIndex}
        loggedUser={this.props.loggedUser}
        recipes={this.state.my_favs}
        dashboardSection={this.props.dashboardSection}
      />
    );
  }
}

MyFavorites.propTypes = {
  reloadRecipes: PropTypes.bool,
  recipes: PropTypes.array,
  actions: PropTypes.object,
  loggedUser: PropTypes.object,
  dashboardSection: PropTypes.string
};

export default MyFavorites;