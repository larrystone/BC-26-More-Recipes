import React, { Component } from 'react';
import { Card, Image, Grid, Icon } from 'semantic-ui-react';

import { connect } from 'react-redux';

import { setDialogType } from '../actions/dialog';
import { setRecipe } from '../actions/recipe';

class RecipeItem extends Component {
  showRecipeActions = () => {
    const { dashboardSection } = this.props;

    if (dashboardSection === 'home') {
      const { upvotes, downvotes } = this.props.recipe;
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
      )
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
                this.props.setRecipe({
                  id: this.props.recipe.id,
                  name: this.props.recipe.name
                });
                this.props.setDialogType('create_edit_recipe');
              }}>
              <Icon name='edit' color='green' />Edit
            </Grid.Column>
            <Grid.Column className="clickable"
              onClick={() => {
                this.props.setRecipe({
                  id: this.props.recipe.id,
                  name: this.props.recipe.name
                });
                this.props.setDialogType('delete_recipe');
              }}>
              <Icon name='delete' color='red' />Delete
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
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
                this.props.setRecipe({
                  id: this.props.recipe.id,
                  name: this.props.recipe.name
                });
                this.props.setDialogType('remove_recipe');
              }}>
              <Icon name='close' color='red' />Remove
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    }
  }

  showAuthor = (User) => {
    if (User) {
      return (
        <Card.Meta>by <em>{User.name}</em></Card.Meta>
      )
    }
  }

  render() {
    const { imageUrl, name, description, User } = this.props.recipe;
    return (
      <Card centered color='green'>
        <Image
          alt='food image'
          src={imageUrl} className="clickable" height="180px"
          onClick={() => {
            this.handleViewRecipe();
          }}
        />
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Card.Description>{description}</Card.Description>
          {this.showAuthor(User)}
        </Card.Content>
        <Card.Content extra>
          {this.showRecipeActions()}
        </Card.Content>
      </Card>
    )
  }

  handleViewRecipe = () => {
    if (!this.props.username) {
      this.props.setDialogType('signup');
    } else {
      this.props.setRecipe({
        id: this.props.recipe.id,
        name: this.props.recipe.name
      });
      this.props.setDialogType('recipe_details');
    }
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    dashboardSection: state.dashboard
  }
}

export default connect(mapStateToProps, { setDialogType, setRecipe })(RecipeItem);
