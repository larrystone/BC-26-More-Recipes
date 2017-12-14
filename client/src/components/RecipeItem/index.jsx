import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'semantic-ui-react';
import defaultImage from '../../../images/default_image.jpg';

const RecipeItem = ({ recipe: { imageUrl, name, description, User } }) => {
  return (
    <Card
      className="wow bounceInUp"
      color="green"
      style={{ padding: '5px', margin: '10px' }}
    >
      <Image
        alt="food image"
        src={!imageUrl ? defaultImage : imageUrl}
        className="clickable wow bounceInUp"
        height="180px"
      />
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Description className="desc">{description}</Card.Description>
        <em>by {User.name}</em>
      </Card.Content>
    </Card>
  );
};

RecipeItem.propTypes = {
  recipe: PropTypes.shape().isRequired
};

export default RecipeItem;
