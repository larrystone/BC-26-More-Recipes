import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Icon } from 'semantic-ui-react';

import noImage from '../../../images/noImage.jpg';
import notify from '../../utils/notify';

/**
 * @description - Stateless component for rendering pagination view
 *
 * @param {object} props - Props object
 *
 * @returns {view} RecipeItem - Rendered view
 */
function RecipeItem({
  recipe: {
    id, imageUrl, name, description, User, upvotes, downvotes
  }, isAdmin, isFav, actions
}) {
  /**
   * @description - Handles view recipe detail action
   *
   * @returns {void} Nothing
   */
  const handleView = () => {
    if (actions.showDetails) {
      actions.showDetails(id);
    } else {
      notify('error', `Please sign up or sign in to view 
      <br/><em><strong>${name} </strong></em>`);
    }
  };

  /**
   * @description - Render recipe action available on home page
   *
   * @returns {view} view - home actions view
   */
  const homeActions = () => (
    <div className="card--action">
      <div>
        <Icon name="thumbs up" color="green" size="large" />{upvotes}
      </div>
      <div className="item-divider" />
      <div>
        <Icon name="thumbs down" color="red" size="large" />{downvotes}
      </div>
    </div >
  );

  /**
   * @description - Render recipe action available on user recipes page
   *
   * @returns {view} view - my recipe actions view
   */
  const myRecipesActions = () => (
    <div className="card--action">
      <div
        role="button"
        tabIndex="0"
        className="clickable"
        onClick={() => {
          handleView();
        }}
      >
        <Icon name="eye" color="blue" />View
      </div>
      <div className="item-divider" />
      <div
        role="button"
        tabIndex="0"
        className="clickable"
        onClick={() => {
          actions.editRecipe(name, id, 'create_edit_recipe');
        }}
      >
        <Icon name="edit" color="green" />Edit
      </div>
      <div className="item-divider" />
      <div
        role="button"
        tabIndex="0"
        className="clickable"
        onClick={() => {
          actions.deleteRecipe(name, id, 'myrecipes');
        }}
      >
        <Icon name="delete" color="red" />Delete
      </div>
    </div>
  );

  /**
   * @description - Render recipe action available on user's
   * favorite recipe page
   *
   * @returns {view} view - favorite recipe actions view
   */
  const myFavActions = () => (
    <div className="card--action">
      <div
        role="button"
        tabIndex="0"
        className="clickable"
        onClick={() => {
          handleView();
        }}
      >
        <Icon name="eye" color="blue" />View
      </div>
      <div className="item-divider" />
      <div
        role="button"
        tabIndex="0"
        className="clickable"
        onClick={() => {
          actions.deleteFav(name, id);
        }}
      >
        <Icon name="close" color="red" />Remove
      </div>
    </div>
  );

  /**
   * @description - Set recipe action view to render
   *
   * @returns {view} view - Action view
   */
  const showRecipeActions = () => {
    if (isAdmin) {
      return myRecipesActions();
    }
    if (isFav) {
      return myFavActions();
    }
    return homeActions();
  };

  return (
    <Card
      className="wow bounceInUp food-card"
      color="brown"
      id={`recipe-${id}`}
    >
      <Image
        alt="food image"
        src={!imageUrl ? noImage : imageUrl}
        className="clickable wow bounceInUp foodImage"
        height="180px"
        onClick={() => {
          handleView();
        }}
      />
      <Card.Content>
        <Card.Header className="word-wrap">{name}</Card.Header>
        <Card.Description className="desc">{description}</Card.Description>
        {User ? <em>by {User.name}</em> : ''}
      </Card.Content>
      <Card.Content extra>
        {showRecipeActions()}
      </Card.Content>
    </Card>
  );
}

RecipeItem.propTypes = {
  recipe: PropTypes.shape().isRequired,
  isAdmin: PropTypes.bool,
  isFav: PropTypes.bool,
  actions: PropTypes.shape()
};

RecipeItem.defaultProps = {
  isAdmin: false,
  isFav: false,
  actions: {}
};

export default RecipeItem;
