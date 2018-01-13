import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Icon } from 'semantic-ui-react';
import toastr from 'toastr';

import defaultImage from '../../../images/default_image.jpg';
import styles from '../../../styles/classes';

const RecipeItem = ({
  recipe: {
    id, imageUrl, name, description, User, upvotes, downvotes
  }, isAdmin, isFav, actions
}) => {
  const handleView = () => {
    if (actions.showDetails) {
      actions.showDetails(id);
    } else {
      toastr.error(`Please sign up or sign in to view 
      <br/><em><strong>${name} </strong></em>`);
    }
  };

  const homeActions = () => (
    <div style={styles.actionClass}>
      <div>
        <Icon name="thumbs up" color="green" size="large" />{upvotes}
      </div>
      <div style={styles.itemDivider} />
      <div>
        <Icon name="thumbs down" color="red" size="large" />{downvotes}
      </div>
    </div >
  );

  const myRecipesActions = () => (
    <div style={styles.actionClass}>
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
      <div style={styles.itemDivider} />
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
      <div style={styles.itemDivider} />
      <div
        role="button"
        tabIndex="0"
        className="clickable"
        onClick={() => {
          actions.addModal(name, id, 'myrecipes');
        }}
      >
        <Icon name="delete" color="red" />Delete
      </div>
    </div>
  );

  const myFavActions = () => (
    <div style={styles.actionClass}>
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
      <div style={styles.itemDivider} />
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
      color="green"
      style={{ padding: '5px', margin: '10px' }}
    >
      <Image
        alt="food image"
        src={!imageUrl ? defaultImage : imageUrl}
        className="clickable wow bounceInUp foodImage"
        height="180px"
        onClick={() => {
          handleView();
        }}
      />
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Description className="desc">{description}</Card.Description>
        {User ? <em>by {User.name}</em> : ''}

      </Card.Content>
      <Card.Content extra>
        {showRecipeActions()}
      </Card.Content>
    </Card>
  );
};

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