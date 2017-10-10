import React, { Component } from 'react';
import { Card, Loader } from 'semantic-ui-react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';

import RecipeItem from './RecipeItem';

const TOKEN = read_cookie('more-recipe-token');

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: null
    }
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
        )
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    setTimeout(() => {
      this.fetchTopRecipes();
    }, 3000)
  }

  renderRecipes() {
    const recipes = this.state.recipes;
    if (!recipes) {
      return (
        <Loader active
          style={{ marginTop: "40px" }}
          inline='centered'
          content='Fetching Great Recipes ' />
      )
    } else if (recipes.length === 0) {
      return (
        <div>No recipes found!!!</div>
      )
    } else {
      return (
        recipes.map((recipe) => {
          return (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
            />
          );
        })
      )
    }
  }

  render() {
    return (
      <div>
        <div className="flex-row">
          <div className="brand-logo">
            <div className="full-title">Top Picks</div>
            <div className="rounded-line"></div>
          </div>
          <div>Search box here</div>
        </div>
        <Card.Group>
          {this.renderRecipes()}
        </Card.Group>
      </div>
    )
  }
}

export default Main;