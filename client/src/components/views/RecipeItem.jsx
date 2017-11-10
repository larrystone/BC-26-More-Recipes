import React from 'react';
import { Card, Image, Grid, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const RecipeItem = ({ dashboardSection, recipe, actions, username }) => {
  const setRecipe = () => {
    actions.setRecipe({
      id: recipe.id,
      name: recipe.name
    });
  };

  const handleViewRecipe = () => {
    if (!username) {
      actions.setDialogType('signup');
    } else {
      setRecipe();
      actions.setDialogType('recipe_details');
    }
  };

  const homeActions = () => {
    const { upvotes, downvotes } = recipe;
    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Icon name='thumbs up' color='green' size='large' />{upvotes}
          </Grid.Column>
          <Grid.Column>
            <Icon name='thumbs down' color='red' size='large' />{downvotes}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  const myRecipesActions = () => {
    return (
      <Grid columns={3} divided>
        <Grid.Row>
          <Grid.Column className="clickable"
            onClick={() => {
              handleViewRecipe();
            }}>
            <Icon name='eye' color='blue' />View
          </Grid.Column>
          <Grid.Column className="clickable"
            onClick={() => {
              setRecipe();
              actions.setDialogType('create_edit_recipe');
            }}>
            <Icon name='edit' color='green' />Edit
          </Grid.Column>
          <Grid.Column className="clickable"
            onClick={() => {
              setRecipe();
              actions.setDialogType('delete_recipe');
            }}>
            <Icon name='delete' color='red' />Delete
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  const myFavActions = () => {
    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column className="clickable"
            onClick={() => {
              handleViewRecipe();
            }}>
            <Icon name='eye' color='blue' />View
          </Grid.Column>
          <Grid.Column className="clickable"
            onClick={() => {
              setRecipe();
              actions.setDialogType('remove_recipe');
            }}>
            <Icon name='close' color='red' />Remove
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  const showRecipeActions = () => {
    if (dashboardSection === 'home') {
      return homeActions();
    } else if (dashboardSection === 'my_recipes') {
      return myRecipesActions();
    } else if (dashboardSection === 'my_favs') {
      return myFavActions();
    }
  };

  const showAuthor = (User) => {
    if (User) {
      return (
        <Card.Meta>by <em>{User.name}</em></Card.Meta>
      );
    }
  };

  const { imageUrl, name, description, User } = recipe;
  return (
    <Card color='green'
      style={{ padding: '5px' }}
      centered>
      <Image
        alt='food image'
        src={imageUrl === '' ? 'images/default_image.jpg' : imageUrl}
        className="clickable" height="180px"
        onClick={() => {
          handleViewRecipe();
        }}
      />
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Description>{description}</Card.Description>
        {showAuthor(User)}
      </Card.Content>
      <Card.Content extra>
        {showRecipeActions()}
      </Card.Content>
    </Card>
  );
};

RecipeItem.propTypes = {
  actions: PropTypes.object,
  setDialogType: PropTypes.func,
  recipe: PropTypes.object,
  setRecipe: PropTypes.func,
  dashboardSection: PropTypes.string,
  username: PropTypes.string
};

export default RecipeItem;
