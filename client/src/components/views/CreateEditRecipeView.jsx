import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const FIRST_INDEX = 0;

const CreateEditRecipe = ({ actions, recipeId, name, description,
  ingredients, direction, loading, modal, error }) => {
  const showHeading = () => {
    if (recipeId) {
      return 'Edit ';
    } else {
      return 'Create ';
    }
  };

  const renderButton = () => {
    if (recipeId) {
      return (
        <Button positive icon='checkmark' labelPosition='right' content='Update'
          onClick={() => {
            actions.updateRecipe();
          }} />
      );
    } else {
      return (
        <Button positive icon='checkmark' labelPosition='right' content='Save'
          onClick={() => {
            actions.saveRecipe();
          }} />
      );
    }
  };

  const renderForm = () => {
    return (
      <Form>
        <Form.Input
          required
          disabled={loading}
          label='Recipe Name'
          placeholder='Enter recipe name'
          value={name}
          onChange={(event) => {
            actions.storeToState('name', event.target.value);
          }} />
        <Form.Input
          disabled={loading}
          label='Choose new image (Max Size: 200kb)'
          type='file'
          accept="image/*"
          onChange={(event) => {
            actions.storeToState('imageUrl', event.target.files[FIRST_INDEX]);
          }} />
        <Form.Input
          disabled={loading}
          label='Recipe Description'
          placeholder='Enter a short description'
          value={description}
          onChange={(event) => {
            actions.storeToState('description', event.target.value);
          }} />
        <Form.Input
          required
          disabled={loading}
          label='Ingredients'
          placeholder='Enter ingredient list separated by comma'
          value={ingredients.replace(/;;/g, ',')}
          onChange={(event) => {
            actions.storeToState('ingredients', event.target.value);
          }} />
        <Form.TextArea
          required
          disabled={loading}
          label='Preparation Procedure'
          placeholder='Enter recipe preparation procedure'
          value={direction}
          onChange={(event) => {
            actions.storeToState('direction', event.target.value);
          }} />
      </Form>
    );
  };

  return (
    <Modal open={modal === 'create_edit_recipe'}>
      <Modal.Header>
        {`${showHeading()} a Recipe`}
      </Modal.Header>
      <Modal.Content>
        {renderForm()}
        <div className='error'>
          {error}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button negative icon='close' labelPosition='right' content='Cancel'
          onClick={() => {
            actions.closeModal();
          }} />
        {renderButton()}
      </Modal.Actions>
    </Modal>
  );
};

CreateEditRecipe.propTypes = {
  actions: PropTypes.object,
  recipeId: PropTypes.number,
  direction: PropTypes.string,
  ingredients: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  loading: PropTypes.bool,
  modal: PropTypes.string,
  error: PropTypes.string
};

export default CreateEditRecipe;