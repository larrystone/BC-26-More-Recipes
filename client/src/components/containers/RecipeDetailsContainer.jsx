import React, { PureComponent } from 'react';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import PropTypes from 'prop-types';

import RecipeDetailsView from '../views/RecipeDetailsView';

const TOKEN = read_cookie('more-recipe-token');
const EMPTY = 0, ONE = 1,
  STATUS_OK = 201, STATUS_NO_CONTENT = 205;

class RecipeDetailsContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipe: {},
      isFav: false,
      likedBy: [],
      dislikedBy: [],
      loading: false
    };
  }

  close = () => {
    this.props.setDialogType('');
  }

  fetchLikedBys() {
    axios({
      method: 'GET',
      url: `/api/v1/recipes/${this.props.recipe.id}/upvotes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const likes = response.data.recipe;

        const userLikes = likes.map((like) => {
          if (like.User.id === this.props.userId) {
            return 'You';
          } else
            return like.User.name;
        });

        this.setState(
          { likedBy: userLikes }
        );
      })
      .catch(() => {
      });
  }

  fetchDislikedBys() {
    axios({
      method: 'GET',
      url: `/api/v1/recipes/${this.props.recipe.id}/downvotes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const dislikes = response.data.recipe;

        const userDislikes = dislikes.map((dislike) => {
          if (dislike.User.id === this.props.userId) {
            return 'You';
          } else
            return dislike.User.name;
        });

        this.setState(
          { dislikedBy: userDislikes }
        );
      })
      .catch(() => {
      });
  }

  fetchFavorites() {
    axios({
      method: 'GET',
      url: `/api/v1/users/${this.props.userId}/recipes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const favorites = response.data.recipe;

        const fav = favorites.filter((favorite) => {
          return this.props.recipe.id === favorite.recipeId;
        });

        if (fav.length !== EMPTY) {
          this.setState(
            { isFav: true }
          );
        }
      })
      .catch(() => {
      });
  }

  fetchRecipeDetails() {
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
        );
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
        if (response.status === STATUS_OK) {
          if (voteType === 'upvotes') {
            const { likedBy, dislikedBy, recipe } = this.state;
            let downvotes;
            if (dislikedBy.includes('You')) {
              const newDislikedBy = dislikedBy.filter((by) => {
                return by !== 'You';
              });
              downvotes = { 'downvotes': recipe.downvotes - ONE };
              this.setState(
                {
                  dislikedBy: newDislikedBy
                }
              );
            }

            this.setState(
              {
                likedBy: [...likedBy, 'You'],
                recipe: Object.assign(
                  {}, recipe, { upvotes: recipe.upvotes + ONE }, downvotes
                )
              }
            );
          } else {
            const { likedBy, dislikedBy, recipe } = this.state;
            let upvotes;
            if (likedBy.includes('You')) {
              const newlikedBy = likedBy.filter((by) => {
                return by !== 'You';
              });
              upvotes = { upvotes: recipe.upvotes - ONE };
              this.setState(
                {
                  likedBy: newlikedBy
                }
              );
            }

            this.setState(
              {
                dislikedBy: [...dislikedBy, 'You'],
                recipe: Object.assign(
                  {}, recipe, { 'downvotes': recipe.downvotes + ONE }, upvotes
                )
              }
            );
          }
        }
      })
      .catch(() => {
      });
  }

  addToFavs = () => {
    this.setState(
      { loading: true }
    );
    axios({
      method: 'POST',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipe.id}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === STATUS_OK) {
          this.setState(
            {
              isFav: true,
              loading: false
            }
          );
        }
      })
      .catch(() => {
        this.setState(
          { loading: false }
        );
      });
  }

  removeFromFavs = () => {
    this.setState(
      { loading: true }
    );
    axios({
      method: 'DELETE',
      url: `/api/v1/users/${this.props.userId}/recipes/${this.props.recipe.id}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        if (response.status === STATUS_NO_CONTENT) {
          this.setState(
            {
              isFav: false,
              loading: false
            }
          );
        }
      })
      .catch(() => {
      });
  }

  render() {
    return (
      <RecipeDetailsView
        actions={
          {
            voteRecipe: this.voteRecipe,
            addToFavs: this.addToFavs,
            removeFromFavs: this.removeFromFavs,
            close: this.close
          }
        }
        recipe={this.state.recipe}
        isFav={this.state.isFav}
        loading={this.state.loading}
        likedBy={this.state.likedBy}
        dislikedBy={this.state.dislikedBy}
        modal={this.props.modal}
        recipeName={this.props.recipe.name}
      />
    );
  }
}

RecipeDetailsContainer.propTypes = {
  recipe: PropTypes.object,
  setDialogType: PropTypes.func,
  userId: PropTypes.number,
  modal: PropTypes.string
};

export default RecipeDetailsContainer;
