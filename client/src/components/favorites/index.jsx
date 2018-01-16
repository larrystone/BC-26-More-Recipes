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
 * @class Recipes
 * @extends {Component}
 * @param {string} page - current page
 * @param {string} pageSize - selected page size
 * @param {string} newPage - selected page
 * @param {string} recipeName - recipe name
 * @param {number} recipeId - recipe ID
 */
class Favorites extends Component {
  /**
   * Creates an instance of Recipes.
   * @param {any} props
   * @memberof Recipes
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
   * @memberof Recipes
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
        Toastr.error(message);
      });
  }

  onPageSizeChange = (page, pageSize) => {
    const { url } = this.state;
    this.context.router.history.push(`${url}page=${page}&limit=${pageSize}`);
  };

  onPageChange = (newPage) => {
    const { url, limit } = this.state;
    this.context.router.history.push(`${url}page=${newPage}&limit=${limit}`);
  };

  showDetails = (recipeId) => {
    this.context.router.history.push(`/recipe/${recipeId}`);
  };

  addModal = (recipeName, recipeId) => {
    this.props.addModal({
      type: 'favorites',
      recipeName,
      recipeId
    });
  }

  removeModal = () => {
    this.props.removeModal();
  }

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
  * @memberof Recipes
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
