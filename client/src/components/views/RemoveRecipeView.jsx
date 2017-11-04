import React from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const RemoveRecipe = ({ actions, name, error, modal }) => {

  return (
    <Modal dimmer='blurring'
      open={modal === 'remove_recipe'}
      basic size='mini'
      onClose={() => {
        actions.closeModal();
      }}
    >
      <Header icon='archive' content={name} />
      <Modal.Content>
        <p>Are you sure you want to remove this
          recipe from your favorite recipes list?</p>
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
            actions.removeRecipe();
          }} />
      </Modal.Actions>
    </Modal>
  );
};

RemoveRecipe.propTypes = {
  modal: PropTypes.string,
  error: PropTypes.string,
  name: PropTypes.string,
  actions: PropTypes.object
};

export default RemoveRecipe;