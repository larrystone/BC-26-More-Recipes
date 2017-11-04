import React, { Component } from 'react';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import PropTypes from 'prop-types';

import RemoveRecipeView from '../views/RemoveRecipeView';

const TOKEN = read_cookie('more-recipe-token');
const STATUS_NO_CONTENT = 205;

class RemoveRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  closeModal = () => {
    this.props.actions.setDialogType('');
  }

  removeRecipe = () => {
    axios({
      method: 'DELETE',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipe.id}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === STATUS_NO_CONTENT) {
          this.props.actions.setReloadRecipes(true);
          this.closeModal();
        }
      })
      .catch(() => {
      });
  }

  render() {
    return (
      <RemoveRecipeView
        actions={
          {
            closeModal: this.closeModal,
            removeRecipe: this.removeRecipe
          }
        }
        error={this.state.error}
        name={this.props.recipe.name}
        modal={this.props.modal} />
    );
  }
}

RemoveRecipe.propTypes = {
  recipe: PropTypes.object,
  modal: PropTypes.string,
  setReloadRecipes: PropTypes.func,
  actions: PropTypes.object,
  userId: PropTypes.number
};

export default RemoveRecipe;