import React, { Component } from 'react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import PropTypes from 'prop-types';

import MyRecipesView from '../views/MyRecipesView';

const TOKEN = 'more-recipe-token';

class MyRecipesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      my_recipes: null
    };
  }

  storeToState(key, value) {
    this.setState(
      {
        [key]: value,
        error: ''
      }
    );
  }

  fetchRecipes() {
    axios({
      method: 'GET',
      url: '/api/v1/users/myRecipes',
      headers: { 'x-access-token': read_cookie(TOKEN) }
    })
      .then((response) => {
        this.setState(
          {
            my_recipes: response.data.recipe
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
      <MyRecipesView
        actions={this.props.actions}
        loggedUser={this.props.loggedUser}
        recipes={this.state.my_recipes}
        dashboardSection={this.props.dashboardSection} />
    );
  }
}

MyRecipesContainer.propTypes = {
  dashboardSection: PropTypes.string,
  reloadRecipes: PropTypes.bool,
  setReloadRecipes: PropTypes.func,
  actions: PropTypes.object,
  loggedUser: PropTypes.object
};

export default MyRecipesContainer;