import React, { PureComponent } from 'react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import PropTypes from 'prop-types';

import RecipeHomeView from '../views/RecipeHomeView';

const TOKEN = read_cookie('more-recipe-token');

class RecipeHomeContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipes: null,
      searchCategory: 'recipes',
      searchTerm: '',
      searching: false,
      sought: false
    };
  }

  fetchTopRecipes = () => {
    axios({
      method: 'GET',
      url: '/api/v1/recipes?sort=upvotes&order=descending',
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            recipes: response.data.recipe
          }
        );
      })
      .catch(() => {
      });
  }

  componentDidMount() {
    this.fetchTopRecipes();
  }

  storeToState = (key, value) => {
    this.setState(
      {
        error: '',
        [key]: value
      }
    );
  };

  handleSearch = () => {
    const { searchTerm, searchCategory } = this.state;

    if (searchTerm) {
      this.setState(
        { searching: true }
      );
      axios({
        method: 'GET',
        url: `/api/v1/recipes?${searchCategory}=
${searchTerm.replace(/\s+/g, '+')}`,
        headers: { 'x-access-token': TOKEN }
      })
        .then((response) => {
          this.setState(
            {
              recipes: response.data.recipe,
              searching: false,
              sought: true
            }
          );
        })
        .catch(() => {
        });
    }
  }

  render() {
    const { searching, sought, recipes } = this.state;
    return (
      <RecipeHomeView
        itemActions={this.props.actions}
        mainActions={
          {
            storeToState: this.storeToState,
            handleSearch: this.handleSearch,
            fetchTopRecipes: this.fetchTopRecipes
          }
        }
        dashboardSection={this.props.dashboardSection}
        loggedUser={this.props.loggedUser}
        recipes={recipes}
        searching={searching}
        sought={sought}
      />
    );
  }
}

RecipeHomeContainer.propTypes = {
  actions: PropTypes.object,
  dashboardSection: PropTypes.string,
  loggedUser: PropTypes.object
};

export default RecipeHomeContainer;