import React, { Component } from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import PropTypes from 'prop-types';

import { setDialogType } from '../actions/dialog';
import { setReloadRecipes } from '../actions/reload_recipe';

const TOKEN = read_cookie('more-recipe-token'),
  FIRST_INDEX = 0;

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

  storeToState(key, value) {
    this.setState(
      {
        [key]: value,
        error: ''
      }
    );
  }

  componentDidMount() {
    const { recipeId } = this.props;
    if (recipeId) {
      this.setState(
        { loading: true }
      );
      axios({
        method: 'GET',
        url: `/api/v1/recipes/${recipeId}`,
        headers: { 'x-access-token': TOKEN }
      })
        .then((response) => {
          const {
            name, description,
            ingredients, direction
          } = response.data.recipe;
          this.setState(
            {
              name,
              description,
              ingredients,
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

  closeModal() {
    this.props.setDialogType('');
  }

  updateRecipe() {
    const { recipeId } = this.props;
    const { name, description, ingredients, direction } = this.state;
    this.setState(
      { loading: true }
    );
    axios({
      method: 'PUT',
      url: `/api/v1/recipes/${recipeId}`,
      headers: { 'x-access-token': TOKEN },
      data: {
        name, description, direction,
        ingredients: ingredients.replace(/,/g, ';;')
      }
    })
      .then((response) => {
        const { success } = response.data;
        if (success === true) {
          this.props.setReloadRecipes(true);
          this.closeModal();
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

  saveRecipe() {
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
          this.props.setReloadRecipes(true);
          this.closeModal();
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

  showHeading() {
    const { recipeId } = this.props;
    if (recipeId) {
      return 'Edit ';
    } else {
      return 'Create ';
    }
  }

  renderButton() {
    const { recipeId } = this.props;
    if (recipeId) {
      return (
        <Button positive icon='checkmark' labelPosition='right' content='Update'
          onClick={() => {
            this.updateRecipe();
          }} />
      );
    } else {
      return (
        <Button positive icon='checkmark' labelPosition='right' content='Save'
          onClick={() => {
            this.saveRecipe();
          }} />
      );
    }
  }

  renderForm() {
    const { name, description, ingredients, direction, loading } = this.state;
    return (
      <Form>
        <Form.Input
          disabled={loading}
          label='Recipe Name'
          placeholder='Enter recipe name'
          value={name}
          onChange={(event) => {
            this.storeToState('name', event.target.value);
          }} />
        <Form.Field>
          <label>Recipe Image</label>
          <input
            disabled={this.props.recipeId !== null}
            type='file'
            accept="image/*"
            onChange={(event) => {
              this.storeToState('imageUrl', event.target.files[FIRST_INDEX]);
            }}
          />
        </Form.Field>
        <Form.Input
          disabled={loading}
          label='Recipe Description'
          placeholder='Enter a short description'
          value={description}
          onChange={(event) => {
            this.storeToState('description', event.target.value);
          }} />
        <Form.Input
          disabled={loading}
          label='Ingredients'
          placeholder='Enter ingredient list separated by comma'
          value={ingredients.replace(/;;/g, ',')}
          onChange={(event) => {
            this.storeToState('ingredients', event.target.value);
          }} />
        <Form.TextArea
          disabled={loading}
          label='Preparation Procedure'
          placeholder='Enter recipe preparation procedure'
          value={direction}
          onChange={(event) => {
            this.storeToState('direction', event.target.value);
          }} />
      </Form>
    );
  }

  render() {
    return (
      <Modal open={this.props.modal === 'create_edit_recipe'}>
        <Modal.Header>
          {this.showHeading()} a Recipe
          </Modal.Header>
        <Modal.Content>
          {this.renderForm()}
          <div className='error'>
            {this.state.error}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button negative icon='close' labelPosition='right' content='Cancel'
            onClick={() => {
              this.closeModal();
            }} />

          {this.renderButton()}
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.dialog,
    recipeId: state.recipe.id
  };
};

const actionCreators = {
  setDialogType,
  setReloadRecipes
};

CreateEditRecipe.propTypes = {
  modal: PropTypes.string,
  setReloadRecipes: PropTypes.func,
  recipeId: PropTypes.number,
  setDialogType: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(CreateEditRecipe);