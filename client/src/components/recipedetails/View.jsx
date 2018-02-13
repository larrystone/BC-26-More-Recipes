import React from 'react';
import moment from 'moment';
import {
  Divider, Icon, Button,
  List, Card, Image, Popup
} from 'semantic-ui-react';
import PropTypes, { object } from 'prop-types';

import Reviews from './Reviews';
import Loading from '../commons/Loading';

import { dateOptions } from '../../constants';
import noImage from '../../../images/noImage.jpg';

/**
 * @description - Stateless component for rendering recipe details
 *
 * @param {object} props - Component's props
 *
 * @returns {view} RecipeDetailsView - Rendered view
 */
function RecipeDetailsView({
  actions, newReview, posting,
  isFav, loading,
  index, recipe, reviews
}) {
  /**
   * @description - Renders the ingredients list
   *
   * @returns {view} View - Rendered view
   */
  const renderIngredients = () => (
    <List
      bulleted
      animated
      items={recipe.ingredients.split(';;')}
    />
  );

  /**
   * @description - Toggles the favorite avatar
   *
   * @returns {view} view - Rendered view
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
   * @description - Render the like button
   *
   * @returns {view} likeButton - Rendered button
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
   * @description - Render the dislike button
   *
   * @returns {view} dislikeButton - Rendered button
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
   * @description - Get the recipe details views
   *
   * @returns {view} Card - Rendered view
   */
  const recipeDetails = () => {
    const {
      User, createdAt, description,
      procedure,
      name, imageUrl, viewCount
    } = recipe;
    return (
      <div>
        <Card.Group className="flex pad__10">
          <Card color="blue" className="card--recipe-details">
            <Image
              alt="food image"
              height="450px"
              src={imageUrl === '' ? noImage : imageUrl}
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
              <div className="card--action">
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
                <div className="item-divider" />
                {dislikeButton()}
                <div className="item-divider" />
                {likeButton()}
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
   * @description - Renders the recipe details view
   * or a loader
   *
   * @returns {view} View - Rendered view
   */
  const renderRecipeDetails = () => {
    if (loading || !recipe.id) {
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
}

RecipeDetailsView.propTypes = {
  actions: PropTypes.shape().isRequired,
  isFav: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
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
