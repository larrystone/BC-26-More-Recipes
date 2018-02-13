import React, { PureComponent } from 'react';
import PropTypes, { object } from 'prop-types';
import { connect } from 'react-redux';

import Header from '../header';
import View from './View';
import Footer from '../commons/Footer';

import { fetchRecipeDetails } from '../../actions/recipeActions';
import {
  fetchSingleFavorite, addFav, removeFav
} from '../../actions/favActions';
import { upvote, downvote } from '../../actions/voteActions';
import {
  fetchRecipeReviews, addRecipeReview
} from '../../actions/reviewActions';
import notify from '../../utils/notify';

/**
 * @description - Container component for fetching recipe details
 *
 * @class RecipeDetails
 *
 * @param {string} key - Name for item to store in state
 *
 * @param {string} value - Value to be stored in state
 *
 * @extends {PureComponent}
 */
export class RecipeDetail extends PureComponent {
  /**
   * @description - Creates an instance of RecipeDetails.
   *
   * @param {object} props - Component's props
   *
   * @memberof RecipeDetail
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      index: 0,
      content: '',
      posting: false,
      error: ''
    };

    this.addFav = this.addFav.bind(this);
    this.removeFav = this.removeFav.bind(this);
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.storeToState = this.storeToState.bind(this);
    this.addReview = this.addReview.bind(this);
  }

  /**
   * @description - Component will mount
   *
   * @memberof RecipeDetail
   *
   * @returns {void} Nothing
   */
  componentWillMount() {
    const { id } = this.props.match.params;

    this.setState({
      isLoading: true
    });

    this.props.fetchRecipeDetails(id)
      .then(() => {
        this.setState({
          isLoading: false
        });
        this.props.fetchSingleFavorite(id);
        this.props.fetchRecipeReviews(id);
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        });
        notify('error', error.response.data.message);
      });
  }

  /**
   * @description Add a recipe to favorites
   *
   * @memberof RecipeDetail
   *
   * @returns {void} Nothing
   */
  addFav() {
    this.props.addFav(this.props.recipe.id)
      .catch((error) => {
        this.setState({ error: error.response.data.message });
      });
  }

  /**
   * @description Remove a recipe from favorites
   *
   * @memberof RecipeDetail
   *
   * @returns {void} Nothing
   */
  removeFav() {
    this.props.removeFav(this.props.recipe.id)
      .catch((error) => {
        this.setState({ error: error.response.data.message });
      });
  }

  /**
   * @description Upvote a recipe
   *
   * @memberof RecipeDetail
   *
   * @returns {void} Nothing
   */
  upvote() {
    this.props.upvote(this.props.recipe.id)
      .then(() => {
        notify('success', 'Recipe upvoted');
      })
      .catch((error) => {
        notify('error', error.response.data.message);
      });
  }

  /**
   * @description Downvote a recipe
   *
   * @memberof RecipeDetail
   *
   * @returns {void} Nothing
   */
  downvote() {
    this.props.downvote(this.props.recipe.id)
      .then(() => {
        notify('success', 'Recipe downvoted');
      })
      .catch((error) => {
        notify('error', error.response.data.message);
      });
  }

  /**
   * @description - Stores data into the component state object
   *
   * @memberof RecipeDetail
   *
   * @param {string} key - Name for storing item in component's state
   *
   * @param {string} value - Value to store in component's state
   *
   * @returns {void} Nothing
   */
  storeToState(key, value) {
    this.setState({
      [key]: value
    });
  }

  /**
   * @description Add a new recipe reviewI
   *
   * @memberof RecipeDetail
   *
   * @returns {void} Nothing
   */
  addReview() {
    const { content } = this.state;
    this.setState({
      posting: true,
      index: 0
    });

    this.props.addRecipeReview(this.props.recipe.id, { content })
      .then(() => {
        this.setState({
          posting: false,
          content: ''
        });
      })
      .catch((error) => {
        this.setState({
          posting: false
        });
        notify('error', error.response.data.message);
      });
  }

  /**
   * @description - Renders component
   *
   * @returns {view} view - Rendered view
   *
   * @memberof RecipeDetail
   */
  render() {
    return (
      <div className="body">
        <Header />
        <main>
          <div className="push-down">
            <View
              recipe={this.props.recipe}
              reviews={this.props.reviews}
              index={this.state.index}
              isFav={this.props.isFav}
              actions={{
                removeFav: this.removeFav,
                addFav: this.addFav,
                upvote: this.upvote,
                downvote: this.downvote,
                storeToState: this.storeToState,
                addReview: this.addReview
              }}
              loading={this.state.isLoading}
              posting={this.state.posting}
              newReview={this.state.content}
              error={this.state.error}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

/**
 * @description - Maps data from redux state to props
 *
 * @param {object} state - Redux state
 *
 * @returns {object} props - Component's props
 */
const mapStateToProps = state => ({
  userId: state.auth.user.id,
  recipe: state.recipe.currentRecipe,
  reviews: state.review.reviews,
  isFav: state.favorite.isFav
});

RecipeDetail.propTypes = {
  reviews: PropTypes.arrayOf(object).isRequired,
  isFav: PropTypes.bool.isRequired,
  addRecipeReview: PropTypes.func.isRequired,
  downvote: PropTypes.func.isRequired,
  upvote: PropTypes.func.isRequired,
  removeFav: PropTypes.func.isRequired,
  addFav: PropTypes.func.isRequired,
  recipe: PropTypes.shape().isRequired,
  fetchSingleFavorite: PropTypes.func.isRequired,
  fetchRecipeReviews: PropTypes.func.isRequired,
  fetchRecipeDetails: PropTypes.func.isRequired,
  match: PropTypes.shape().isRequired
};

const actionCreators = {
  fetchRecipeDetails,
  fetchRecipeReviews,
  fetchSingleFavorite,
  removeFav,
  addFav,
  upvote,
  downvote,
  addRecipeReview
};


export default connect(mapStateToProps, actionCreators)(RecipeDetail);
