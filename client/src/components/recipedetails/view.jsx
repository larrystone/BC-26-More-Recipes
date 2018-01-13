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
import defaultImage from '../../../images/default_image.jpg';

import styles from '../../../styles/classes';

const EMPTY = 0;

const RecipeDetailsView = ({
  actions, newReview, posting,
  isFav, loading, likedBy = [], dislikedBy = [],
  index, recipe, reviews
}) => {
  const renderIngredients = () => (
    <List
      bulleted
      animated
      items={recipe.ingredients.split(';;')}
    />
  );

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

  const likeButton = () => (
    <Button
      compact
      color="green"
      icon="thumbs outline up"
      label={recipe.upvotes}
      labelPosition="right"
      onClick={() => actions.upvote(recipe.id)}
    />
  );

  const dislikeButton = () => (
    <Button
      compact
      color="red"
      icon="thumbs outline down"
      label={recipe.downvotes}
      labelPosition="right"
      onClick={() => actions.downvote(recipe.id)}
    />
  );

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
              // width="966px"
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
                  compact
                  color="blue"
                  icon="eye"
                  label={viewCount}
                  labelPosition="right"
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
