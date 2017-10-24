import React, { Component } from 'react';
import { Card, Loader, Message, Button } from 'semantic-ui-react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RecipeItem from './RecipeItem';

import { setDialogType } from '../actions/dialog';
import { setReloadRecipes } from '../actions/reload_recipe';
import { setRecipe } from '../actions/recipe';

const TOKEN = 'more-recipe-token', EMPTY = 0;

class Main extends Component {
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
      );
    } else if (recipes.length === EMPTY) {
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
      );
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
      );
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
              this.props.setRecipe({
                id: null,
                name: null
              });
              this.props.setDialogType('create_edit_recipe');
            }}
          />
        </div>
        <Card.Group>
          {this.renderRecipes()}
        </Card.Group>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reloadRecipes: state.reloadRecipes,
    recipe: state.recipe
  };
};

const actionCreators = {
  setDialogType,
  setReloadRecipes,
  setRecipe
};

Main.propTypes = {
  setDialogType: PropTypes.func,
  setRecipe: PropTypes.func,
  reloadRecipes: PropTypes.bool,
  setReloadRecipes: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(Main);