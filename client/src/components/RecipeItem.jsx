import React, { Component } from 'react';
import { Card, Image, Grid, Icon } from 'semantic-ui-react';

import { connect } from 'react-redux';

import { setDialogType } from '../actions/dialog';
import { setRecipeId } from '../actions/recipe';

class RecipeItem extends Component {
  showRecipeActions = () => {
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
          <Card.Meta>by <em>{User.name}</em></Card.Meta>
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
      this.props.setRecipeId(this.props.recipe.id);
      this.props.setDialogType('recipe_details');
    }
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username
  }
}

export default connect(mapStateToProps, { setDialogType, setRecipeId })(RecipeItem);
