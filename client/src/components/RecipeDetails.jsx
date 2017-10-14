import React, { Component } from 'react';
import { connect } from 'react-redux';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import moment from 'moment';
import {
  Divider, Icon, Loader,
  Button, Grid,
  Card, Modal, Image, Popup
} from 'semantic-ui-react';

import Reviews from './Reviews';

import { setRecipe } from '../actions/recipe';
import { setDialogType } from '../actions/dialog';

const TOKEN = read_cookie('more-recipe-token');

class RecipeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: null,
      isFav: false,
      likedBy: 'None',
      dislikedBy: 'None'
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

  fetchLikedBys = () => {
    axios({
      method: 'GET',
      url: `/api/v1/recipes/${this.props.recipe.id}/upvotes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const likes = response.data.recipe;

        const userLikes = likes.map((like) => {
          if (like.User.id === this.props.userId) {
            return 'You'
          } else
            return like.User.name;
        });

        this.setState(
          { likedBy: userLikes.toString().replace(this.props.username, 'You') }
        )
      })
      .catch(() => {
      });
  }

  fetchDislikedBys = () => {
    axios({
      method: 'GET',
      url: `/api/v1/recipes/${this.props.recipe.id}/downvotes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const dislikes = response.data.recipe;

        const userDislikes = dislikes.map((dislike) => {
          if (dislike.User.id === this.props.userId) {
            return 'You'
          } else
            return dislike.User.name;
        });

        this.setState(
          { dislikedBy: userDislikes.toString() }
        )
      })
      .catch(() => {
      });
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
          return this.props.recipe.id === favorite.recipeId
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
      url: `/api/v1/recipes/${this.props.recipe.id}`,
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
    this.fetchLikedBys();
    this.fetchDislikedBys();
  }

  voteRecipe = (voteType) => {
    axios({
      method: 'POST',
      url: `/api/v1/recipes/${this.props.recipe.id}/${voteType}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === 201) {
          this.fetchRecipeDetails();
          this.fetchDislikedBys();
          this.fetchLikedBys();
        }
      })
      .catch((err) => {
      });
  }

  addToFavs = () => {
    axios({
      method: 'POST',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipe.id}`,
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
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipe.id}`,
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

  showUserLiked = () => {
    const { upvotes } = this.state.recipe;
    const { likedBy } = this.state;
    if (likedBy) {
      return (
        <Popup
          inverted
          trigger={
            <Button compact
              color='green'
              icon='thumbs outline up'
              label={upvotes}
              labelPosition='right'
              onClick={() => this.voteRecipe('upvotes')}
            />
          }
          content={<div><Icon name='thumbs outline up' size='large' />: &nbsp;&nbsp;{this.state.likedBy}</div>}
        />
      )
    } else {
      return (
        <Button compact
          color='green'
          icon='thumbs outline up'
          label={upvotes}
          labelPosition='right'
          onClick={() => this.voteRecipe('upvotes')}
        />
      )
    }
  }

  showUserDisliked = () => {
    const { downvotes } = this.state.recipe;
    const { dislikedBy } = this.state;
    if (dislikedBy) {
      return (
        <Popup
          inverted
          trigger={
            <Button compact
              color='red'
              icon='thumbs outline down'
              label={downvotes}
              labelPosition='right'
              onClick={() => this.voteRecipe('downvotes')}
            />
          }
          content={<div><Icon name='thumbs outline down' size='large' />: &nbsp;&nbsp;{dislikedBy}</div>}
        />
      )
    } else {
      return (
        <Button compact
          color='red'
          icon='thumbs outline down'
          label={downvotes}
          labelPosition='right'
          onClick={() => this.voteRecipe('downvotes')}
        />
      )
    }
  }

  renderRecipeDetails = () => {
    const recipe = this.state.recipe;
    if (!recipe) {
      return (
        <Loader active
          size='large'
          inline='centered'
          content={`Loading  '${this.props.recipe.name}'...`} />
      )
    } else {
      const {
        name,
        description,
        imageUrl,
        User,
        direction,
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
                    {this.showUserLiked()}
                  </Grid.Column>
                  <Grid.Column>
                    {this.showUserDisliked()}
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
      <Modal
        basic size='fullscreen'
        open={modal === 'recipe_details'}
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
    recipe: state.recipe,
    modal: state.dialog,
    userId: state.user.id
  }
}

const actionCreators = {
  setRecipe,
  setDialogType
}

export default connect(mapStateToProps, actionCreators)(RecipeDetails);
