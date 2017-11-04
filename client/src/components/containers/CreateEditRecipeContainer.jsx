import React, { Component } from 'react';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import PropTypes from 'prop-types';

import CreateEditRecipeView from '../views/CreateEditRecipeView';

const TOKEN = read_cookie('more-recipe-token');

class CreateEditRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      ingredients: '',
      imageUrl: '',
      direction: '',
      error: '',
      loading: false
    };
  }

  storeToState = (key, value) => {
    this.setState(
      {
        [key]: value,
        error: ''
      }
    );
  }

  componentDidMount() {
    const { recipe } = this.props;
    if (recipe.id) {
      this.setState(
        { loading: true }
      );
      axios({
        method: 'GET',
        url: `/api/v1/recipes/${recipe.id}`,
        headers: { 'x-access-token': TOKEN }
      })
        .then((response) => {
          const {
            name, description,
            imageUrl,
            ingredients, direction
          } = response.data.recipe;
          this.setState(
            {
              name,
              description,
              ingredients,
              imageUrl,
              direction,
              loading: false
            }
          );
        })
        .catch((error) => {
          this.setState(
            {
              error: error.response.data.message,
              loading: false
            }
          );
        });
    }
  }

  closeModal = () => {
    this.props.actions.setDialogType('');
  }

  updateRecipe = () => {
    const data = new FormData();

    const { recipe } = this.props;
    const { imageUrl, name, description, ingredients, direction } = this.state;

    data.append('name', name);
    data.append('description', description);
    data.append('ingredients', ingredients.replace(/,/g, ';;'));
    data.append('direction', direction);
    data.append('image', imageUrl);

    this.setState(
      { loading: true }
    );
    axios({
      method: 'PUT',
      url: `/api/v1/recipes/${recipe.id}`,
      headers: { 'x-access-token': TOKEN },
      data
    })
      .then((response) => {
        const { success } = response.data;
        if (success === true) {
          this.closeModal();
          this.props.actions.setReloadRecipes(true);
        }
      })
      .catch((error) => {
        this.setState(
          {
            error: error.response.data.message,
            loading: false
          }
        );
      });
  }

  saveRecipe = () => {
    const data = new FormData();

    const { imageUrl, name, description, ingredients, direction } = this.state;

    data.append('name', name);
    data.append('description', description);
    data.append('ingredients', ingredients.replace(/,/g, ';;'));
    data.append('direction', direction);
    data.append('image', imageUrl);

    this.setState(
      { loading: true }
    );
    axios({
      method: 'POST',
      url: '/api/v1/recipes',
      headers: { 'x-access-token': TOKEN },
      data
    })
      .then((response) => {
        const { success } = response.data;
        if (success === true) {
          this.closeModal();
          this.props.actions.setReloadRecipes(true);
        }
      })
      .catch((error) => {
        this.setState(
          {
            error: error.response.data.message,
            loading: false
          }
        );
      });
  }

  render() {
    return (
      <CreateEditRecipeView
        actions={
          {
            closeModal: this.closeModal,
            storeToState: this.storeToState,
            saveRecipe: this.saveRecipe,
            updateRecipe: this.updateRecipe
          }
        }
        modal={this.props.modal}
        name={this.state.name}
        description={this.state.description}
        ingredients={this.state.ingredients}
        direction={this.state.direction}
        error={this.state.error}
        recipeId={this.props.recipe.id}
      />
    );
  }
}

CreateEditRecipe.propTypes = {
  modal: PropTypes.string,
  setReloadRecipes: PropTypes.func,
  setDialogType: PropTypes.func,
  actions: PropTypes.object,
  recipe: PropTypes.object
};

export default CreateEditRecipe;