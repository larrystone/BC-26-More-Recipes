import React, { Component } from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { read_cookie } from 'sfcookies';
import axios from 'axios';

import { setDialogType } from '../actions/dialog';
import { setReloadRecipes } from '../actions/reload_recipe';

const TOKEN = read_cookie('more-recipe-token');

class CreateEditRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      ingredients: '',
      direction: '',
      error: '',
      loading: false
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

  componentDidMount() {
    const { recipeId } = this.props;
    if (recipeId) {
      this.setState(
        { loading: true }
      )
      axios({
        method: 'GET',
        url: `/api/v1/recipes/${recipeId}`,
        headers: { 'x-access-token': TOKEN }
      })
        .then((response) => {
          const { name, description, ingredients, direction } = response.data.recipe;
          this.setState(
            {
              name,
              description,
              ingredients,
              direction,
              loading: false
            }
          )
        })
        .catch((error) => {
          this.setState(
            {
              error: error.response.data.message,
              loading: false
            }
          )
        });
    }
  }

  closeModal = () => {
    this.props.setDialogType('');
  }

  updateRecipe = () => {
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
        ingredients: ingredients.replace(/,/g, ';;'),
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
        )
      });
  }

  saveRecipe = () => {
    const { name, description, ingredients, direction } = this.state;
    this.setState(
      { loading: true }
    );
    axios({
      method: 'POST',
      url: '/api/v1/recipes',
      headers: { 'x-access-token': TOKEN },
      data: {
        name, description, direction,
        ingredients: ingredients.replace(/,/g, ';;'),
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
        )
      });
  }

  showHeading = () => {
    const { recipeId } = this.props;
    if (recipeId) {
      return 'Edit ';
    } else {
      return 'Create ';
    }
  }

  renderButton = () => {
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

  renderForm = () => {
    const { name, description, ingredients, direction, loading } = this.state;
    return (
      <Form>
        <Form.Input
          disabled={loading}
          label='Recipe Name'
          placeholder='Enter recipe name'
          value={name}
          onChange={(event) => {
            this.storeToState('name', event.target.value)
          }} />
        <Form.Input
          disabled={loading}
          label='Recipe Description'
          placeholder='Enter a short description'
          value={description}
          onChange={(event) => {
            this.storeToState('description', event.target.value)
          }} />
        <Form.Input
          disabled={loading}
          label='Ingredients'
          placeholder='Enter ingredient list separated by comma'
          value={ingredients.replace(/;;/g, ',')}
          onChange={(event) => {
            this.storeToState('ingredients', event.target.value)
          }} />
        <Form.TextArea
          disabled={loading}
          label='Preparation Procedure'
          placeholder='Enter recipe preparation procedure'
          value={direction}
          onChange={(event) => {
            this.storeToState('direction', event.target.value)
          }} />
      </Form>
    )
  }

  render() {
    return (
      <Modal open={this.props.modal === 'create_edit_recipe'}>
        <Modal.Header>
          {this.showHeading()} Recipe
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
              this.closeModal()
            }} />

          {this.renderButton()}
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.dialog,
    recipeId: state.recipe.id
  }
}

export default connect(mapStateToProps, { setDialogType, setReloadRecipes })(CreateEditRecipe);