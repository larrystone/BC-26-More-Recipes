import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import toastr from 'toastr';

import Header from '../Header';
import View from './View';
import Footer from '../commons/Footer';
import Delete from '../commons/Delete';

import { fetchFavorites, removeFav } from '../../actions/favActions';
import { addModal, removeModal } from '../../actions/modalActions';

import notify from '../../utils/notify';

/**
 * @description - User recipes container
 *
 * @class Favorites
 *
 * @extends {Component}
 */
class Favorites extends Component {
  /**
   * @description - Creates an instance of Favorites.
   *
   * @param {object} props - Component Props
   *
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
   * @description - Fetches favorite recipes of the user
   *
   * @memberof Favorites
   *
   * @returns {void} Nothing
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
        notify('error', message);
      });
  }

  /**
   * @description - Handles fetching recipe on new page size request
   *
   * @memberof Favorites
   *
   * @param {number} currentPage - Current page
   *
   * @param {number} pageSize - new page size
   *
   * @returns {void} Nothing
   */
  onPageSizeChange = (currentPage, pageSize) => {
    const { url } = this.state;
    this.context.router.history
      .push(`${url}page=${currentPage}&limit=${pageSize}`);
  };

  /**
   * @description - Handles fetching recipe on new page request
   *
   * @memberof Favorites
   *
   * @param {number} newPage - new page number
   *
   * @returns {void} Nothing
   */
  onPageChange = (newPage) => {
    const { url, limit } = this.state;
    this.context.router.history.push(`${url}page=${newPage}&limit=${limit}`);
  };

  /**
   * @description - Calls the route that allow recipe detail to viewed
   *
   * @memberof Favorites
   *
   * @param {number} recipeId - Recipe ID
   *
   * @returns {void} Nothing
   */
  showDetails = (recipeId) => {
    this.context.router.history.push(`/recipe/${recipeId}`);
  };

  /**
   * @description - Adds the modal for removing recipe to the window
   *
   * @memberof Favorites
   *
   * @param {string} recipeName - recipe name to show in modal
   * @param {number} recipeId - recipe ID
   *
   * @returns {void} Nothing
   */
  addModal = (recipeName, recipeId) => {
    this.props.addModal({
      type: 'favorites',
      recipeName,
      recipeId
    });
  }

  /**
   * @description - Removes the modal from the window
   *
   * @memberof Favorites
   *
   * @returns {void} Nothing
   */
  removeModal = () => {
    this.props.removeModal();
  }

  /**
   * @description - Removes recipe from favorites
   *
   * @memberof Favorites
   *
   * @param {string} recipeName - Name of recipe to remove
   *
   * @param {number} recipeId - ID of recipe to remove
   *
   * @returns {void} Nothing
   */
  removeRecipe = (recipeName, recipeId) => {
    this.props.removeFav(recipeId)
      .then(() => {
        this.removeModal();
        toastr
          .success(`You have removed <em><strong>${recipeName}</strong></em>`);
      })
      .catch((error) => {
        this.setState({ error: error.response.data.message });
      });
  }

  /**
  * @description - Call Views for component rendering
  *
  * @returns {object} View - Rendered view
  *
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
