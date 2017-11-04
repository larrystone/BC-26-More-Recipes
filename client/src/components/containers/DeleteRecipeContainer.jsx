import React, { Component } from 'react';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import PropTypes from 'prop-types';

import DeleteRecipeView from '../views/DeleteRecipeView';

const TOKEN = read_cookie('more-recipe-token');
const STATUS_NO_CONTENT = 205;

class DeleteRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  closeModal = () => {
    this.props.actions.setDialogType('');
  }

  deleteRecipe = () => {
    const { recipe } = this.props;

    axios({
      method: 'DELETE',
      url: `/api/v1/recipes/${recipe.id}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === STATUS_NO_CONTENT) {
          this.props.actions.setReloadRecipes(true);
          this.closeModal();
        }
      })
      .catch((error) => {
        this.setState(
          { error: error.response.data.message }
        );
      });
  }

  render() {
    return (
      <DeleteRecipeView
        actions={
          {
            closeModal: this.closeModal,
            deleteRecipe: this.deleteRecipe
          }
        }
        error={this.state.error}
        name={this.props.recipe.name}
        modal={this.props.modal}
      />
    );
  }
}

DeleteRecipe.propTypes = {
  actions: PropTypes.object,
  recipe: PropTypes.object,
  modal: PropTypes.string
};

export default DeleteRecipe;