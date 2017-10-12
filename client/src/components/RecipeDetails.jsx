import React, { Component } from 'react';
import { connect } from 'react-redux';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import moment from 'moment';
import {
  Divider, Icon, Loader,
  Label, Button, Grid,
  Card, Modal, Image
} from 'semantic-ui-react';

import Reviews from './Reviews';

import { setRecipeId } from '../actions/recipe';
import { setDialogType } from '../actions/dialog';

const TOKEN = read_cookie('more-recipe-token');

class RecipeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: null,
      isFav: false
    }
  }

  close = () => this.props.setDialogType('');

  renderIngredients = () => {
    const ingredients = this.state.recipe.ingredients.split(';;');
    return (
      ingredients.map((ingredient, index) => {
        return <li key={index}>{ingredient}</li>;
      })
    )
  }

  fetchFavorites = () => {
    axios({
      method: 'GET',
      url: `/api/v1/users/${this.props.userId}/recipes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const favorites = response.data.recipe;

        const fav = favorites.filter((favorite) => {
          return this.props.recipeId === favorite.recipeId
        })

        if (fav.length !== 0) {
          this.setState(
            { isFav: true }
          )
        }
      })
      .catch(() => {
      });
  }

  fetchRecipeDetails = () => {
    axios({
      method: 'GET',
      url: `/api/v1/recipes/${this.props.recipeId}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            recipe: response.data.recipe
          }
        )
      })
      .catch(() => {
      });
  }

  componentDidMount() {
    this.fetchRecipeDetails();
    this.fetchFavorites();
  }

  voteRecipe = (voteType) => {
    axios({
      method: 'POST',
      url: `/api/v1/recipes/${this.props.recipeId}/${voteType}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === 201) {
          this.fetchRecipeDetails();
        }
      })
      .catch((err) => {
      });
  }

  addToFavs = () => {
    axios({
      method: 'POST',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipeId}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState(
            { isFav: true }
          )
        }
      })
      .catch(() => {
      });
  }

  removeFromFavs = () => {
    axios({
      method: 'DELETE',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipeId}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === 205) {
          this.setState(
            { isFav: false }
          )
        }
      })
      .catch(() => {
      });
  }

  renderIsFavorite = () => {
    const isFav = this.state.isFav;
    if (isFav) {
      return (
        <Icon name='star' size='large'
          color='yellow'
          onClick={() => {
            this.removeFromFavs()
          }} />
      )
    } else {
      return (
          <Icon name='empty star' size='large'
            onClick={() => {
              this.addToFavs()
            }} />
      )
    }
  }

  renderRecipeDetails = () => {
    const recipe = this.state.recipe;
    if (!recipe) {
      return (
        <Loader active
          inline='centered'
          content='Fetching Recipe Details...' />
      )
    } else {
      const {
        name,
        description,
        imageUrl,
        User,
        direction,
        upvotes,
        downvotes,
        viewCount,
        createdAt
      } = this.state.recipe;

      return (
        <Card.Group>
          <Card centered color='green' style={{ width: "500px" }}>
            <Image
              alt='food image'
              src={imageUrl}>
            </Image>
            <Card.Content>
              <Card.Header>{name} {this.renderIsFavorite()}</Card.Header>
              <Card.Description>{description}</Card.Description>
              <Card.Meta>by <b>{User.name}</b> - <em>{moment(new Date(createdAt)).fromNow()}</em></Card.Meta>

              <Divider />

              <Card.Header>Ingredients</Card.Header>
              <Card.Description>
                <ul>
                  {this.renderIngredients()}
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
                    <Button compact
                      color='green'
                      icon='thumbs outline up'
                      label={upvotes}
                      labelPosition='right'
                      onClick={() => this.voteRecipe('upvotes')}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Button compact
                      color='red'
                      icon='thumbs outline down'
                      label={downvotes}
                      labelPosition='right'
                      onClick={() => this.voteRecipe('downvotes')}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Reviews />
        </Card.Group>
      )
    }
  }

  render() {
    const { modal } = this.props;

    return (
      <Modal basic open={modal === 'recipe_details'} size='fullscreen'
        onClose={() => this.close()} closeIcon>
        <Modal.Content>
          {this.renderRecipeDetails()}
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    recipeId: state.recipe,
    modal: state.dialog,
    userId: state.user.id
  }
}

const actionCreators = {
  setRecipeId,
  setDialogType
}

export default connect(mapStateToProps, actionCreators)(RecipeDetails);