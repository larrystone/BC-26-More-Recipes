import React, { Component } from 'react';
import { Card, Loader, Message, Button } from 'semantic-ui-react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import { connect } from 'react-redux';

import RecipeItem from './RecipeItem';

import { setDialogType } from '../actions/dialog';
import { setReloadRecipes } from '../actions/reload_recipe';

const TOKEN = 'more-recipe-token';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      my_recipes: null,
      recipe_name: '',
      recipe_description: '',
      recipe_ingredients: '',
      recipe_direction: ''
    }
  }

  storeToState(key, value) {
    this.setState(
      {
        [key]: value,
        error: ''
      }
    )
  }

  fetchRecipes = () => {
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
        this.props.setReloadRecipes(false);
      })
      .catch(() => {
      });
  }

  componentDidMount() {
    this.fetchRecipes();
  }

  renderRecipes() {
    const recipes = this.state.my_recipes;
    if (!recipes) {
      return (
        <Loader active inline='centered' content='Fetching My Recipes' />
      )
    } else if (recipes.length === 0) {
      return (
        <Message
          style={{ width: '100%', margin: '10px' }}
          color='green'
          size='large'>
          <Message.Header content="Nothing found!" />
          <Message.Content className="error">
            Sorry, you have not created any Recipes....
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
    if (this.props.reloadRecipes) {
      this.fetchRecipes();
    }
    return (
      <div>
        <div className="flex-row">
          <div className="brand-logo">
            <div className="full-title">My Recipes</div>
            <div className="rounded-line"></div>
          </div>
          <Button
            label='New Recipe'
            labelPosition='right'
            circular
            icon='plus'
            color='teal'
            onClick={() => {
              this.props.setDialogType('create_recipe')
            }}
          />
        </div>
        <Card.Group>
          {this.renderRecipes()}
        </Card.Group>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    reloadRecipes: state.reloadRecipes
  }
}

export default connect(mapStateToProps, { setDialogType, setReloadRecipes })(Main);