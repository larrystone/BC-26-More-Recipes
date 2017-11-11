import React from 'react';
import moment from 'moment';
import {
  Divider, Icon, Loader, Button, Grid,
  List, Card, Modal, Image, Popup
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ReviewsContainer from '../containers/ReviewsContainer';
import { dateOptions } from '../../constants';

const EMPTY = 0;

const RecipeDetailsView = ({ actions,
  isFav, loading, likedBy, dislikedBy,
  recipeName, modal, recipe }) => {
  const renderIngredients = () => {
    return (
      <List
        bulleted
        animated
        items={recipe.ingredients.split(';;')}
      />
    );
  };

  const renderIsFavorite = () => {
    if (isFav) {
      return (
        <Icon loading
          name='star' size='large'
          color='yellow'
          onClick={() => {
            if (!loading) {
              actions.removeFromFavs();
            }
          }} />
      );
    } else {
      return (
        <Icon name='empty star' size='large'
          onClick={() => {
            if (!loading) {
              actions.addToFavs();
            }
          }} />
      );
    }
  };

  const likeButton = () => {
    return (
      <Button compact
        color='green'
        icon='thumbs outline up'
        label={recipe.upvotes}
        labelPosition='right'
        onClick={() => actions.voteRecipe('upvotes')}
      />
    );
  };

  const dislikeButton = () => {
    return (
      <Button compact
        color='red'
        icon='thumbs outline down'
        label={recipe.downvotes}
        labelPosition='right'
        onClick={() => actions.voteRecipe('downvotes')}
      />
    );
  };

  const showUserLiked = () => {
    if (likedBy.length !== EMPTY) {
      return (
        <Popup
          inverted
          trigger={likeButton()}
          content={
            <div>
              <List
                size='mini'
                items={likedBy}
              />
            </div>
          }
        />
      );
    } else {
      return likeButton();
    }
  };

  const showUserDisliked = () => {
    if (dislikedBy.length !== EMPTY) {
      return (
        <Popup
          inverted
          trigger={dislikeButton()}
          content={
            <div>
              <List
                size='mini'
                items={dislikedBy}
              />
            </div>
          }
        />
      );
    } else {
      return dislikeButton();
    }
  };

  const recipeDetails = () => {
    const {
      User, createdAt, description,
      direction,
      name, imageUrl, viewCount
    } = recipe;
    return (
      <Card.Group>
        <Card centered color='green' style={{ width: '500px' }}>
          <Image
            alt='food image'
            height='220px'
            src={imageUrl === '' ? 'images/default_image.jpg' : imageUrl}
            className='clickable'
          />
          <Card.Content>
            <Card.Header>{name} {renderIsFavorite()}</Card.Header>
            <Card.Description>{description}</Card.Description>
            <Card.Meta>by <b>{User.name}</b>
              <Popup
                inverted
                size='mini'
                trigger={
                  <em>
                    - {moment(new Date(createdAt)).fromNow()}
                  </em>
                }
                content={
                  <div>
                    {new Date(createdAt)
                      .toLocaleDateString('en-US', dateOptions)}
                  </div>
                }
              />
            </Card.Meta>

            <Divider />

            <Card.Header>Ingredients</Card.Header>
            <Card.Description>
              <ul>
                {renderIngredients()}
              </ul>
            </Card.Description>

            <Divider />

            <Card.Header>Direction</Card.Header>
            <Card.Description>
              <p>{direction}</p>
            </Card.Description>

            <Divider />

            <Grid columns={3}>
              <Grid.Row divided>
                <Grid.Column>
                  <Button compact
                    color='blue'
                    icon='eye'
                    label={viewCount}
                    labelPosition='right'
                  />
                </Grid.Column>
                <Grid.Column>
                  {showUserLiked()}
                </Grid.Column>
                <Grid.Column>
                  {showUserDisliked()}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
        <ReviewsContainer />
      </Card.Group>
    );
  };

  const renderRecipeDetails = () => {
    if (!recipe.id) {
      return (
        <Loader active
          size='large'
          inline='centered'
          content={`Loading  '${recipeName}'...`} />
      );
    } else {
      return recipeDetails();
    }
  };

  return (
    <Modal
      basic size='fullscreen'
      open={modal === 'recipe_details'}
      onClose={() => actions.close()} closeIcon>
      <Modal.Content>
        {renderRecipeDetails()}
      </Modal.Content>
    </Modal>
  );
};

RecipeDetailsView.propTypes = {
  actions: PropTypes.object,
  isFav: PropTypes.bool,
  loading: PropTypes.bool,
  likedBy: PropTypes.array,
  dislikedBy: PropTypes.array,
  recipe: PropTypes.object,
  recipeName: PropTypes.string,
  modal: PropTypes.string
};

export default RecipeDetailsView;