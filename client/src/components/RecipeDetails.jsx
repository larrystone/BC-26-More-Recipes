import React, { Component } from 'react';
import { connect } from 'react-redux';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import moment from 'moment';
import {
  Divider, Icon, Loader,
  Button, Grid, List,
  Card, Modal, Image, Popup
} from 'semantic-ui-react';

import Reviews from './Reviews';

import { setDialogType } from '../actions/dialog';

const TOKEN = read_cookie('more-recipe-token');

class RecipeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      User: null,
      createdAt: '',
      description: '',
      direction: '',
      downvotes: 0,
      ingredients: '',
      name: '',
      upvotes: 0,
      viewCount: 0,
      isFav: false,
      likedBy: [],
      dislikedBy: [],
      loading: false
    }
  }

  close = () => this.props.setDialogType('');

  renderIngredients = () => {
    const ingredients = this.state.ingredients.split(';;');
    return (
      <List
        bulleted
        animated
        items={ingredients}
      />
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
          { likedBy: userLikes }
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
          { dislikedBy: userDislikes }
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
        const {
          id,
          User,
          createdAt,
          description,
          direction,
          downvotes,
          ingredients,
          name,
          upvotes,
          viewCount
        } = response.data.recipe

        this.setState(
          {
            id,
            User,
            createdAt,
            description,
            direction,
            downvotes,
            ingredients,
            name,
            upvotes,
            viewCount
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
          if (voteType === 'upvotes') {
            const { likedBy, dislikedBy, downvotes, upvotes } = this.state;

            if (dislikedBy.includes('You')) {
              const newDislikedBy = dislikedBy.filter((by) => {
                return by !== 'You';
              });
              this.setState(
                {
                  dislikedBy: newDislikedBy,
                  downvotes: downvotes - 1
                }
              );
            }

            this.setState(
              {
                likedBy: [...likedBy, 'You'],
                upvotes: upvotes + 1,
              }
            );
          } else {
            const { likedBy, dislikedBy, upvotes, downvotes } = this.state;

            if (likedBy.includes('You')) {
              const newlikedBy = likedBy.filter((by) => {
                return by !== 'You';
              });
              this.setState(
                {
                  likedBy: newlikedBy,
                  upvotes: upvotes - 1
                }
              );
            }

            this.setState(
              {
                dislikedBy: [...dislikedBy, 'You'],
                downvotes: downvotes + 1,
              }
            );
          }
        }
      })
      .catch((err) => {
      });
  }

  addToFavs = () => {
    this.setState(
      { loading: true }
    )
    axios({
      method: 'POST',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipe.id}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState(
            {
              isFav: true,
              loading: false
            }
          )
        }
      })
      .catch(() => {
        this.setState(
          { loading: false }
        )
      });
  }

  removeFromFavs = () => {
    this.setState(
      { loading: true }
    )
    axios({
      method: 'DELETE',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipe.id}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === 205) {
          this.setState(
            {
              isFav: false,
              loading: false
            }
          )
        }
      })
      .catch(() => {
      });
  }

  renderIsFavorite = () => {
    const isFav = this.state.isFav;
    const { loading } = this.state;
    if (isFav) {
      return (
        <Icon loading
          name='star' size='large'
          color='yellow'
          onClick={() => {
            if (!loading) {
              this.removeFromFavs();
            }
          }} />
      )
    } else {
      return (
        <Icon name='empty star' size='large'
          onClick={() => {
            if (!loading) {
              this.addToFavs();
            }
          }} />
      )
    }
  }

  likeButton = () => {
    const { upvotes } = this.state;
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

  dislikeButton = () => {
    const { downvotes } = this.state;
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

  showUserLiked = () => {
    const { likedBy } = this.state;
    if (likedBy.length !== 0) {
      return (
        <Popup
          inverted
          trigger={this.likeButton()}
          content={
            <div>
              <List
                size='mini'
                items={this.state.likedBy}
              />
            </div>
          }
        />
      )
    } else {
      return this.likeButton();
    }
  }

  showUserDisliked = () => {
    const { dislikedBy } = this.state;
    if (dislikedBy.length !== 0) {
      return (
        <Popup
          inverted
          trigger={this.dislikeButton()}
          content={
            <div>
              <List
                size='mini'
                items={this.state.dislikedBy}
              />
            </div>
          }
        />
      )
    } else {
      return this.dislikeButton();
    }
  }

  renderRecipeDetails = () => {
    const { id } = this.state;
    if (!id) {
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
      } = this.state;

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
              <Card.Meta>by <b>{User.name}</b> - <em>
                {moment(new Date(createdAt)).fromNow()}
              </em></Card.Meta>

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

export default connect(mapStateToProps, { setDialogType })(RecipeDetails);
