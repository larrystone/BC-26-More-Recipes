import React, { Component } from 'react';
import { Modal, Icon, Button, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { read_cookie } from 'sfcookies';
import axios from 'axios';

import { setDialogType } from '../actions/dialog';
import { setReloadRecipes } from '../actions/reload_recipe';

const TOKEN = read_cookie('more-recipe-token');

class DeleteRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeName: ''
    }
  }

  closeModal = () => {
    this.props.setDialogType('');
  }

  deleteRecipe = () => {
    const { recipe } = this.props;

    axios({
      method: 'DELETE',
      url: `/api/v1/recipes/${recipe.id}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === 205) {
          this.props.setReloadRecipes(true);
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
    const { name } = this.props.recipe;
    return (
      <Modal dimmer='blurring'
        open={this.props.modal === 'delete_recipe'}
        basic size='mini'
        onClose={() => {
          this.closeModal()
        }}
      >
        <Header icon='archive' content={`${name}`} />
        <Modal.Content>
          <p>Are you sure you want to delete this recipe?</p>
          <div className='error'>
            {this.state.error}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button negative icon='close' labelPosition='right' content='No'
            onClick={() => {
              this.closeModal()
            }} />

          <Button positive icon='checkmark' labelPosition='right' content='Yes'
            onClick={() => {
              this.deleteRecipe();
            }} />
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.dialog,
    recipe: state.recipe
  }
}

export default connect(mapStateToProps, { setDialogType, setReloadRecipes })(DeleteRecipe);