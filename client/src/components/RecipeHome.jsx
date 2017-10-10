import React, { Component } from 'react';
import { Card, Loader, Input, Message, Select, Button } from 'semantic-ui-react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';

import RecipeItem from './RecipeItem';

const TOKEN = read_cookie('more-recipe-token');

const options = [
  { key: 'recipes', text: 'by Name', value: 'recipes' },
  { key: 'ingredients', text: 'by Ingredient', value: 'ingredients' }
]

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: null,
      searchCategory: 'recipes',
      searchTerm: ''
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
    this.fetchTopRecipes();
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
        <Message
          style={{ width: '100%', marginTop: '10px' }}
          color='green'
          size='large'>
          <Message.Header content="Nothing found!" />
          <Message.Content className="error">
            Sorry, no recipes found!!!
          </Message.Content>
        </Message>
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
          <div>
            <Input type='text' placeholder='Search for recipe...' action
              onChange={(event) => {
                this.setState(
                  { searchTerm: event.target.value }
                )
              }}>
              <input />
              <Select compact options={options} defaultValue='recipes'
                onChange={(event, data) => {
                  this.setState(
                    { searchCategory: data.value }
                  )
                }}
              />
              <Button type='submit' positive
                icon='search'
                onClick={() => { this.handleSearch() }}
              >
              </Button>
            </Input>
          </div>
        </div>
        <Card.Group>
          {this.renderRecipes()}
        </Card.Group>
      </div>
    )
  }
}

export default Main;