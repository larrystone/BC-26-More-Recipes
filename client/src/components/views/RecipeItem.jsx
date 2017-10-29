import React from 'react';
import { Card, Image, Grid, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const RecipeItem = ({ dashboardSection, recipe, actions, username }) => {
  const showRecipeActions = () => {
    if (dashboardSection === 'home') {
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
    } else if (dashboardSection === 'my_recipes') {
      return (
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column className="clickable"
              onClick={() => {
                this.handleViewRecipe();
              }}>
              <Icon name='eye' color='blue' />View
            </Grid.Column>
            <Grid.Column className="clickable"
              onClick={() => {
                actions.setRecipe({
                  id: recipe.id,
                  name: recipe.name
                });
                actions.setDialogType('create_edit_recipe');
              }}>
              <Icon name='edit' color='green' />Edit
            </Grid.Column>
            <Grid.Column className="clickable"
              onClick={() => {
                actions.setRecipe({
                  id: this.props.recipe.id,
                  name: this.props.recipe.name
                });
                actions.setDialogType('delete_recipe');
              }}>
              <Icon name='delete' color='red' />Delete
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else if (dashboardSection === 'my_favs') {
      return (
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column className="clickable"
              onClick={() => {
                this.handleViewRecipe();
              }}>
              <Icon name='eye' color='blue' />View
            </Grid.Column>
            <Grid.Column className="clickable"
              onClick={() => {
                actions.setRecipe({
                  id: this.props.recipe.id,
                  name: this.props.recipe.name
                });
                actions.setDialogType('remove_recipe');
              }}>
              <Icon name='close' color='red' />Remove
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  };

  const showAuthor = (User) => {
    if (User) {
      return (
        <Card.Meta>by <em>{User.name}</em></Card.Meta>
      );
    }
  };

  const handleViewRecipe = () => {
    if (!username) {
      actions.setDialogType('signup');
    } else {
      actions.setRecipe({
        id: this.props.recipe.id,
        name: this.props.recipe.name
      });
      actions.setDialogType('recipe_details');
    }
  };

  const { imageUrl, name, description, User } = recipe;
  return (
    <Card centered color='green' >
      <Image
        alt='food image'
        src={imageUrl} className="clickable" height="180px"
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

// const mapStateToProps = (state) => {
//   return {
//     username: state.user.username,
//     dashboardSection: state.dashboard
//   };
// };

RecipeItem.propTypes = {
  actions: PropTypes.object,
  setDialogType: PropTypes.func,
  recipe: PropTypes.object,
  setRecipe: PropTypes.func,
  dashboardSection: PropTypes.string,
  username: PropTypes.string
};

export default RecipeItem;
