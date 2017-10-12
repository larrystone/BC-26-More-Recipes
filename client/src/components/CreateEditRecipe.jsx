import React, { Component } from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { read_cookie } from 'sfcookies';
import axios from 'axios';

import { setDialogType } from '../actions/dialog';

const TOKEN = read_cookie('more-recipe-token');

class CreateEditRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      ingredients: '',
      direction: '',
      error: ''
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

  closeModal = () => {
    this.props.setDialogType('');
  }

  saveRecipe = () => {
    const { name, description, ingredients, direction } = this.state;
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
          this.closeModal();
        }
      })
      .catch((error) => {
        this.setState(
          { error: error.response.data.message }
        )
      });
  }

  render() {
    const { name, description, ingredients, direction } = this.state;
    return (
      <Modal open={this.props.modal === 'create_recipe'}>
        <Modal.Header>
          Create New Recipe
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label='Recipe Name'
              placeholder='Enter recipe name'
              value={name}
              onChange={(event) => {
                this.storeToState('name', event.target.value)
              }} />
            <Form.Input
              label='Recipe Description'
              placeholder='Enter a short description'
              value={description}
              onChange={(event) => {
                this.storeToState('description', event.target.value)
              }} />
            <Form.Input
              label='Ingredients'
              placeholder='Enter ingredient list separated by comma'
              value={ingredients}
              onChange={(event) => {
                this.storeToState('ingredients', event.target.value)
              }} />
            <Form.TextArea
              label='Preparation Procedure'
              placeholder='Enter recipe preparation procedure'
              value={direction}
              onChange={(event) => {
                this.storeToState('direction', event.target.value)
              }} />
          </Form>
          <div className='error'>
            {this.state.error}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button negative icon='close' labelPosition='right' content='Cancel'
            onClick={() => {
              this.closeModal()
            }} />

          <Button positive icon='checkmark' labelPosition='right' content='Save'
            onClick={() => {
              this.saveRecipe();
            }} />
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.dialog
  }
}

export default connect(mapStateToProps, { setDialogType })(CreateEditRecipe);