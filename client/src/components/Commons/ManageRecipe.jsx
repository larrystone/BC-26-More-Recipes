import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Loading from '../commons/Loading';
import noImage from '../../../images/noImage.jpg';

/**
 * @description - Stateless component for rendering
 * the Create or Edit recipe view
 *
 * @param {object} props - Internal props object
 *
 * @returns {view} CreateOrEdit - Rendered view
 */
function CreateOrEdit({
  modal, actions, loading, recipe, previewImage
}) {
  /**
   * Renders button type (Update or Save buttons)
   *
   * @returns {view} Button
   */
  const renderButton = () => {
    if (modal.recipeId) {
      return (
        <Button
          positive
          icon="checkmark"
          labelPosition="right"
          content="Update"
          disabled={loading}
          onClick={() => {
            actions.updateRecipe(modal.recipeId);
          }}
        />
      );
    }
    return (
      <Button
        positive
        icon="checkmark"
        labelPosition="right"
        content="Save"
        disabled={loading}
        onClick={() => {
          actions.saveRecipe();
        }}
      />
    );
  };

  /**
   * Shows form header
   *
   * @returns {string} heading
   */
  const showHeading = () => {
    if (modal.recipeId) {
      return 'Edit ';
    }
    return 'Create ';
  };

  /**
   * Renders the form component
   *
   * @returns {form} Form
   */
  const renderForm = () => (
    <Form
      loading={loading}
    >
      <div className="flex flex__wrap pad__10">
        <div className="form--image">
          <span>
            <strong>
              Recipe Image. click to choose new image (Max Size: 200kb)
            </strong>
          </span>
          <label
            htmlFor="input"
            className="clickable flex image-src"
          >
            <img
              src={previewImage || noImage}
              alt=""
              height="300px"
            />
          </label>
          <Form.Input
            id="input"
            className="hidden"
            disabled={loading}
            name="imageUrl"
            type="file"
            accept="image/*"
            onChange={(event) => {
              actions.handleImageChange(event);
            }}
          />
        </div>
        <div className="basic-info">
          <Form.Input
            required
            disabled={loading}
            label="Recipe Name"
            placeholder="Enter recipe name"
            value={recipe.name}
            onChange={(event) => {
              actions.storeToState('name', event.target.value);
            }}
          />
          <Form.Input
            disabled={loading}
            label="Recipe Description"
            placeholder="Enter a short description"
            value={recipe.description}
            onChange={(event) => {
              actions.storeToState('description', event.target.value);
            }}
          />
          <Form.TextArea
            required
            autoHeight={false}
            disabled={loading}
            label="Ingredients"
            className="recipe--ingredient"
            placeholder="Enter ingredient list separated by comma"
            value={
              recipe.ingredients ? recipe.ingredients.replace(/;;/g, ',') : ''
            }
            onChange={(event) => {
              actions.storeToState('ingredients', event.target.value);
            }}
          />
        </div>
      </div>
      <Form.TextArea
        required
        disabled={loading}
        className="recipe--procedure"
        label="Preparation Procedure"
        placeholder="Enter recipe preparation procedure"
        value={recipe.procedure}
        onChange={(event) => {
          actions.storeToState('procedure', event.target.value);
        }}
      />
    </Form>
  );

  return (
    <Modal open={modal.type === 'create_edit_recipe'}>
      <Modal.Header>
        {`${showHeading()} a Recipe`}
      </Modal.Header>
      <Modal.Content>
        {loading ? <Loading text={modal.recipeName} /> : renderForm()}
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          icon="close"
          labelPosition="right"
          content="Cancel"
          disabled={loading}
          onClick={() => {
            actions.removeModal();
          }}
        />
        {renderButton()}
      </Modal.Actions>
    </Modal>
  );
}

CreateOrEdit.propTypes = {
  modal: PropTypes.shape().isRequired,
  actions: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  recipe: PropTypes.shape().isRequired,
  previewImage: PropTypes.string.isRequired
};

export default CreateOrEdit;
