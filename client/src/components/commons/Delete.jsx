import React from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * Stateless component for rendering recipe removal modal
 *
 * @param {object} props
 * @returns {view} Delete
 */
const Delete = ({
  error, modalType, modal, removeModal, removeRecipe
}) => (
  <Modal
    dimmer="blurring"
    open={modal.type === modalType}
    basic
    size="mini"
    onClose={() => {
      removeModal();
    }}
  >
    <Header icon="archive" content={modal.recipeName} />
    <Modal.Content>
      <p>Are you sure you want to remove this recipe from your
        {modal.type === 'favorites' ? 'favorite' : ''} recipes list?
      </p>
      <div className="error">
        {error}
      </div>
    </Modal.Content>
    <Modal.Actions>
      <Button
        negative
        icon="close"
        labelPosition="right"
        content="No"
        onClick={() => {
          removeModal();
        }}
      />

      <Button
        positive
        icon="checkmark"
        labelPosition="right"
        content="Yes"
        onClick={() => {
          removeRecipe(modal.recipeName, modal.recipeId);
        }}
      />
    </Modal.Actions>
  </Modal>
);

Delete.propTypes = {
  modalType: PropTypes.string.isRequired,
  modal: PropTypes.shape().isRequired,
  error: PropTypes.string.isRequired,
  removeModal: PropTypes.func.isRequired,
  removeRecipe: PropTypes.func.isRequired
};

export default Delete;
