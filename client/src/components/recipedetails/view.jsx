import React from 'react';
import moment from 'moment';
import {
  Divider, Icon, Button,
  List, Card, Image, Popup
} from 'semantic-ui-react';
import PropTypes, { string, object } from 'prop-types';

import Reviews from './reviews';
import Loading from '../commons/Loading';

import { dateOptions } from '../../constants';
import defaultImage from '../../../images/no-image.jpg';

import styles from '../../../styles/classes';

const EMPTY = 0;

/**
 * Stateless component for rendering recipe details
 *
 * @param {object} props
 * @returns {view} RecipeDetailsView
 */
const RecipeDetailsView = ({
  actions, newReview, posting,
  isFav, loading, likedBy = [], dislikedBy = [],
  index, recipe, reviews
}) => {
  /**
   * Renders the ingredients list
   *
   * @returns {view} View
   */
  const renderIngredients = () => (
    <List
      bulleted
      animated
      items={recipe.ingredients.split(';;')}
    />
  );

  /**
   * Toggles the favorite avatar
   *
   * @returns {view} view
   */
  const renderIsFavorite = () => {
    if (isFav) {
      return (
        <Icon
          loading
          name="star"
          size="large"
          color="yellow"
          onClick={() => {
            if (!loading) {
              actions.removeFav(recipe.id);
            }
          }}
        />
      );
    }
    return (
      <Icon
        name="empty star"
        size="large"
        onClick={() => {
          if (!loading) {
            actions.addFav(recipe.id);
          }
        }}
      />
    );
  };

  /**
   * Render the like button
   *
   * @returns {view} button
   */
  const likeButton = () => (
    <Button
      basic
      color="green"
      content="Likes"
      icon="thumbs up"
      label={{
        as: 'a',
        basic: true,
        color: 'green',
        pointing: 'left',
        content: `${recipe.upvotes}`
      }}
      onClick={() => actions.upvote(recipe.id)}
    />
  );

  /**
   * Render the dislike button
   *
   * @returns {view} button
   */
  const dislikeButton = () => (
    <Button
      basic
      color="red"
      content="Dislikes"
      icon="thumbs down"
      label={{
        as: 'a',
        basic: true,
        color: 'red',
        pointing: 'left',
        content: `${recipe.downvotes}`
      }}
      onClick={() => actions.downvote(recipe.id)}
    />
  );

  /**
   * Render the likedBy view
   *
   * @returns {view} popup
   */
  const showUserLiked = () => {
    if (likedBy.length !== EMPTY) {
      return (
        <Popup
          inverted
          trigger={likeButton()}
          content={
            <div>
              <List
                size="mini"
                items={likedBy}
              />
            </div>
          }
        />
      );
    }
    return likeButton();
  };

  /**
   * Render the dislikedBy view
   *
   * @returns {view} pupop
   */
  const showUserDisliked = () => {
    if (dislikedBy.length !== EMPTY) {
      return (
        <Popup
          inverted
          trigger={dislikeButton()}
          content={
            <div>
              <List
                size="mini"
                items={dislikedBy}
              />
            </div>
          }
        />
      );
    }
    return dislikeButton();
  };

  /**
   * Get the recipe details views
   *
   * @returns {view} Card
   */
  const recipeDetails = () => {
    const {
      User, createdAt, description,
      procedure,
      name, imageUrl, viewCount
    } = recipe;
    return (
      <div>
        <Card.Group style={{ justifyContent: 'center', padding: '20px' }}>
          <Card color="blue" style={{ width: '966px' }}>
            <Image
              alt="food image"
              height="450px"
              src={imageUrl === '' ? defaultImage : imageUrl}
            />
            <Card.Content>
              <Card.Header>{name} {renderIsFavorite()}</Card.Header>
              <Card.Description>{description}</Card.Description>
              <Card.Meta>by <b>{User.name}</b>
                <Popup
                  inverted
                  size="mini"
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
              <br />
              <div style={styles.actionClass}>
                <Button
                  basic
                  color="blue"
                  content="Views"
                  icon="eye"
                  label={{
                    as: 'a',
                    basic: true,
                    color: 'blue',
                    pointing: 'left',
                    content: `${viewCount}`
                  }}
                />
                <div style={styles.itemDivider} />
                {showUserLiked()}
                <div style={styles.itemDivider} />
                {showUserDisliked()}
              </div>
              <br />
              <Divider />

              <Card.Header>Ingredients</Card.Header>
              <Card.Description>
                {renderIngredients()}
              </Card.Description>

              <Divider />

              <Card.Header>Procedure</Card.Header>
              <Card.Description>
                <p>{procedure}</p>
              </Card.Description>
            </Card.Content>
          </Card >
          <Reviews
            reviews={reviews}
            index={index}
            posting={posting}
            newReview={newReview}
            actions={actions}
          />
        </Card.Group >
      </div >
    );
  };

  /**
   * Renders the recipe details view
   * or a loader
   *
   * @returns {view} View
   */
  const renderRecipeDetails = () => {
    if (!recipe.id) {
      return (
        <Loading
          text="Recipe"
        />
      );
    }
    return recipeDetails();
  };

  return (
    <div>
      {renderRecipeDetails()}
    </div>
  );
};

RecipeDetailsView.propTypes = {
  actions: PropTypes.shape().isRequired,
  isFav: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  likedBy: PropTypes.arrayOf(string),
  dislikedBy: PropTypes.arrayOf(string),
  recipe: PropTypes.shape().isRequired,
  newReview: PropTypes.string.isRequired,
  posting: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  reviews: PropTypes.arrayOf(object).isRequired
};

RecipeDetailsView.defaultProps = {
  likedBy: [],
  dislikedBy: []
};

export default RecipeDetailsView;
