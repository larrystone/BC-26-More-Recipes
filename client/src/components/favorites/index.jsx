import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toastr from 'toastr';

import Header from '../header';
import View from './view';
import Footer from '../commons/Footer';
import Delete from '../commons/Delete';

import { fetchFavorites, removeFav } from '../../actions/favActions';
import { addModal, removeModal } from '../../actions/modalActions';

/**
 * My recipes container with pagination
 *
 * @class Favorites
 * @extends {Component}
 */
class Favorites extends Component {
  /**
   * Creates an instance of Favorites.
   * @param {any} props
   * @memberof Favorites
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      url: '',
      error: ''
    };
  }

  /**
   * Fetches favorite recipes of the user
   *
   * @memberof Favorites
   * @returns {void} Null
   */
  componentWillMount() {
    this.setState({
      isLoading: true
    });

    this.props.fetchFavorites(this.props.userId)
      .then(() => {
        this.setState({
          isLoading: false
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        });
        const { data: { message } } = error.response;
        Toastr.remove();
        Toastr.error(message);
      });
  }

  /**
   * Handles fetching recipe on new page size request
   *
   * @memberof Favorites
   * @param {number} currentPage
   * @param {number} pageSize
   * @returns {null} Nothing
   */
  onPageSizeChange = (currentPage, pageSize) => {
    const { url } = this.state;
    this.context.router.history
      .push(`${url}page=${currentPage}&limit=${pageSize}`);
  };

  /**
   * Handles fetching recipe on new page request
   *
   * @memberof Favorites
   * @param {number} newPage
   * @returns {null} Nothing
   */
  onPageChange = (newPage) => {
    const { url, limit } = this.state;
    this.context.router.history.push(`${url}page=${newPage}&limit=${limit}`);
  };

  /**
   * Calls the route that allow recipe detail to viewed
   *
   * @memberof Favorites
   * @param {number} recipeId
   * @returns {null} Nothing
   */
  showDetails = (recipeId) => {
    this.context.router.history.push(`/recipe/${recipeId}`);
  };

  /**
   * Adds the modal for removing recipe to the window
   *
   * @memberof Favorites
   * @param {string} recipeName
   * @param {number} recipeId
   * @returns {null} Nothing
   */
  addModal = (recipeName, recipeId) => {
    this.props.addModal({
      type: 'favorites',
      recipeName,
      recipeId
    });
  }

  /**
   * Removes the modal from the window
   *
   * @memberof Favorites
   * @param {string} recipeName
   * @param {number} recipeId
   * @returns {null} Nothing
   */
  removeModal = () => {
    this.props.removeModal();
  }

  /**
   * Remove recipe from the database
   *
   * @memberof Favorites
   * @param {string} recipeName
   * @param {number} recipeId
   * @returns {null} Nothing
   */
  removeRecipe = (recipeName, recipeId) => {
    this.props.removeFav(recipeId, this.props.userId)
      .then(() => {
        this.removeModal();
        Toastr
          .success(`You have removed <em><strong>${recipeName}</strong></em>`);
      })
      .catch((error) => {
        this.setState({ error: error.response.data.message });
      });
  }

  /**
  * Call Views for component rendering
  *
  * @returns {object} View
  * @memberof Favorites
  */
  render() {
    return (
      <div className="body">
        <Delete
          modalType="favorites"
          modal={this.props.modal}
          removeModal={this.removeModal}
          removeRecipe={this.removeRecipe}
          error={this.state.error}
        />
        <Header
          activePage="myfav"
        />
        <main>
          <div className="push-down">
            <View
              addModal={this.addModal}
              isLoading={this.state.isLoading}
              recipes={this.props.recipes}
              showDetails={this.showDetails}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

Favorites.propTypes = {
  userId: PropTypes.number.isRequired,
  fetchFavorites: PropTypes.func.isRequired,
  addModal: PropTypes.func.isRequired,
  removeModal: PropTypes.func.isRequired,
  removeFav: PropTypes.func.isRequired,
  recipes: PropTypes.shape().isRequired,
  modal: PropTypes.shape().isRequired
};

Favorites.contextTypes = {
  router: PropTypes.object.isRequired
};

/**
 * Maps data from state to props
 *
 * @param {any} state
 * @returns {object} props
 */
const mapStateToProps = (state) => {
  const { modal, favorite } = state;
  return {
    recipes: favorite.myFavorites,
    modal: modal.modal,
    userId: state.auth.user.id
  };
};

const actionCreators = {
  fetchFavorites, addModal, removeModal, removeFav
};

export default connect(mapStateToProps, actionCreators)(Favorites);
