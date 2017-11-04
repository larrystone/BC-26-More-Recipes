import React from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const DeleteRecipe = ({ name, actions, modal, error }) => {
  return (
    <Modal dimmer='blurring'
      open={modal === 'delete_recipe'}
      basic size='mini'
      onClose={() => {
        actions.closeModal();
      }} >
      <Header icon='archive' content={name} />
      <Modal.Content>
        <p>Are you sure you want to delete this recipe?</p>
        <div className='error'>
          {error}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button negative icon='close' labelPosition='right' content='No'
          onClick={() => {
            actions.closeModal();
          }} />

        <Button positive icon='checkmark' labelPosition='right' content='Yes'
          onClick={() => {
            actions.deleteRecipe();
          }} />
      </Modal.Actions>
    </Modal>
  );
};

DeleteRecipe.propTypes = {
  actions: PropTypes.object,
  error: PropTypes.string,
  name: PropTypes.string,
  modal: PropTypes.string
};

export default DeleteRecipe;