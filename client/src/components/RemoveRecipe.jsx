import React, { Component } from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import PropTypes from 'prop-types';

import { setDialogType } from '../actions/dialog';
import { setReloadRecipes } from '../actions/reload_recipe';

const TOKEN = read_cookie('more-recipe-token');
const STATUS_NO_CONTENT = 205;

class RemoveRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  closeModal() {
    this.props.setDialogType('');
  }

  removeRecipe() {
    axios({
      method: 'DELETE',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipe.id}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === STATUS_NO_CONTENT) {
          this.props.setReloadRecipes(true);
          this.closeModal();
        }
      })
      .catch(() => {
      });
  }

  render() {
    const { name } = this.props.recipe;
    return (
      <Modal dimmer='blurring'
        open={this.props.modal === 'remove_recipe'}
        basic size='mini'
        onClose={() => {
          this.closeModal();
        }}
      >
        <Header icon='archive' content={name} />
        <Modal.Content>
          <p>Are you sure you want to remove this
          recipe from your favorite recipes list?</p>
          <div className='error'>
            {this.state.error}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button negative icon='close' labelPosition='right' content='No'
            onClick={() => {
              this.closeModal();
            }} />

          <Button positive icon='checkmark' labelPosition='right' content='Yes'
            onClick={() => {
              this.removeRecipe();
            }} />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.dialog,
    recipe: state.recipe,
    userId: state.user.id
  };
};

const actionCreators = {
  setDialogType,
  setReloadRecipes
};

RemoveRecipe.propTypes = {
  setDialogType: PropTypes.func,
  userId: PropTypes.number,
  recipe: PropTypes.object,
  modal: PropTypes.string,
  setReloadRecipes: PropTypes.func
};

export default connect(mapStateToProps, actionCreators)(RemoveRecipe);