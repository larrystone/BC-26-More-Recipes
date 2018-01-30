import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Header from '../Header';
import View from './View';
import Paginate from '../commons/Paginate';
import Footer from '../commons/Footer';
import Delete from '../commons/Delete';
import ManageRecipe from '../commons/ManageRecipe';

import {
  fetchMyRecipes, deleteRecipe, addRecipe, editRecipe, fetchRecipeDetails
} from '../../actions/recipeActions';
import { addModal, removeModal } from '../../actions/modalActions';
import { signOut } from '../../actions/authActions';
import notify from '../../utils/notify';
import {
  validateRecipeDetails
} from '../../../../server/middleware/inputValidation';
/**
 * @description - My recipes container with pagination
 *
 * @class MyRecipes
 *
 * @extends {Component}
 */
class MyRecipes extends Component {
  /**
   * @description - Creates an instance of MyRecipes
   *
   * @param {object} props - Component's props
   *
   * @memberof Recipes
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      limit: 10,
      url: '',
      error: '',
      imageUrl: '',
      name: '',
      description: '',
      ingredients: '',
      procedure: '',
      previewImage: ''
    };
  }

  /**
   * @description - Fetches recipes based on page and limit
   * parameters when components loads
   *
   * @memberof Recipes
   *
   * @returns {void} Nothing
   */
  componentWillMount() {
    const { location } = this.props;
    this.fetchRecipes(location);
  }

  /**
   * @description - Fetches recipes when pagination events occur
   *
   * @param {object} nextProps - Incoming props
   *
   * @memberof MyRecipes
   *
   * @returns {void} Nothing
   */
  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (this.props.location.search !== location.search) {
      this.fetchRecipes(location);
    }
  }

  /**
   * @description - Handles fetching recipe on new page size request
   *
   * @memberof MyRecipes
   *
   * @param {number} currentPage - Current page
   *
   * @param {number} pageSize - New page size
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
   * @memberof MyRecipes
   *
   * @param {number} newPage - New page
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
   * @memberof MyRecipes
   *
   * @param {number} recipeId - Recipe ID
   *
   * @returns {void} Nothing
   */
  showDetails = (recipeId) => {
    this.context.router.history.push(`/recipe/${recipeId}`);
  }

  /**
   * @description - Handle image change
   * For displaying image thumbnail
   *
   * @memberof MyRecipes
   *
   * @param {object} event - Form event object
   *
   * @returns {void} Nothing
   */
  handleImageChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      this.setState({
        [event.target.name]: event.target.files[0]
      });
      const reader = new FileReader();
      reader.onload = (nextEvent) => {
        this.setState({
          previewImage: nextEvent.target.result
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.setState({ imageUrl: '' });
    }
  }

  /**
   * @description - Stores value to component's state
   *
   * @memberof Recipes
   *
   * @param {string} key - Key name to store in component's state
   *
   * @param {string} value - Value to store in component's state
   *
   * @returns {void} Nothing
   */
  storeToState = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  /**
   * @description - Parse the location object
   * and fetch the recipes
   *
   * @param {object} location - Window's location object
   *
   * @memberof MyRecipes
   *
   * @returns {void} Nothing
   */
  fetchRecipes(location) {
    const query = new URLSearchParams(location.search);
    const page = query.get('page');
    const limit = query.get('limit');

    this.setState({
      url: `${location.pathname}?`,
      isLoading: true,
      limit: limit || 10
    });

    this.props.fetchMyRecipes(page, limit)
      .then(() => {
        this.setState({
          isLoading: false,
          sought: false
        });
      })
      .catch((error) => {
        notify('error', error.response.data.message);
        this.setState({
          isLoading: false,
          sought: false
        });
      });
  }

  saveRecipe = () => {
    const data = new FormData();

    const {
      imageUrl, name, description, ingredients, procedure
    } = this.state;

    const recipeDetailsError = validateRecipeDetails(this.state);

    if (recipeDetailsError.length > 0) {
      notify('error', recipeDetailsError);
    } else {
      data.append('name', name);
      data.append('description', description);
      data.append('ingredients', ingredients.replace(/,/g, ';;'));
      data.append('procedure', procedure);
      data.append('image', imageUrl);

      this.setState({ isLoading: true });

      this.props.addRecipe(data)
        .then(() => {
          this.setState({
            isLoading: false
          });
          notify('success', `New recipe created <br/>${name}`);
          this.removeModal();
        })
        .catch((error) => {
          this.setState({
            isLoading: false
          });
          const { data: { message } } = error.response;
          notify('error', message);
        });
    }
  }

  /**
   * @description - Removes a recipe from user recipe list
   *
   * @memberof Recipes
   *
   * @param {number} recipeId - Recipe ID
   *
   * @returns {void} Nothing
   */
  updateRecipe = (recipeId) => {
    const data = new FormData();

    const {
      imageUrl, name, description, ingredients, procedure
    } = this.state;

    const recipeDetailsError = validateRecipeDetails(this.state);

    if (recipeDetailsError.length > 0) {
      notify('error', recipeDetailsError);
    } else {
      data.append('name', name);
      data.append('description', description);
      data.append('ingredients', (ingredients).replace(/,/g, ';;'));
      data.append('procedure', procedure);
      data.append('image', imageUrl);

      this.setState({
        isLoading: true
      });

      this.props.editRecipe(recipeId, data)
        .then(() => {
          this.setState({ isLoading: false });
          notify('success', `Recipe updated <br/>${name}`);
          this.removeModal();
        })
        .catch((error) => {
          this.setState({
            isLoading: false
          });
          const { data: { message } } = error.response;
          notify('error', message);
        });
    }
  }

  /**
   * @description - Adds the modal for creating or editing recipe
   *
   * @memberof Favorites
   *
   * @param {string} recipeName - Recipe name to show in modal
   *
   * @param {number} recipeId - Recipe ID
   *
   * @param {string} modalType - Modal type string
   *
   * @returns {void} Nothing
   */
  addModal = (recipeName, recipeId, modalType) => {
    this.props.addModal({
      type: modalType,
      recipeName,
      recipeId
    });
  }

  /**
   * @description - Shows the create recipe modal
   *
   * @memberof MyRecipes
   *
   * @param {string} modalType - Modal type to show
   *
   * @returns {void} Nothing
   *
   */
  newRecipe = (modalType) => {
    this.setState({
      imageUrl: '',
      name: '',
      description: '',
      ingredients: '',
      procedure: '',
      previewImage: ''
    });
    this.addModal(null, null, modalType);
  }

  /**
   * @description - Shows the edit recipe modal
   *
   * @memberof MyRecipes
   *
   * @param {string} recipeName - Name of recipe
   *
   * @param {number} recipeId - Recipe ID
   *
   * @param {string} modalType - Type of modal
   *
   * @returns {void} Nothing
   *
   */
  editRecipe = (recipeName, recipeId, modalType) => {
    this.setState({ isLoading: true });

    this.addModal(recipeName, recipeId, modalType);
    this.props.fetchRecipeDetails(recipeId)
      .then(() => {
        const {
          imageUrl, name, description, ingredients, procedure
        } = this.props.recipe;
        this.setState({
          isLoading: false,
          name,
          imageUrl,
          procedure,
          description,
          ingredients,
          previewImage: imageUrl
        });
      });
  }

  /**
   * @description - Removes the modal from the window
   *
   * @memberof MyRecipes
   *
   * @returns {void} Nothing
   */
  removeModal = () => {
    this.props.removeModal();
  }

  /**
   * @description - Removes a recipe from the database
   *
   * @memberof MyRecipes
   *
   * @param {string} recipeName - Name of recipe
   *
   * @param {number} recipeId - Recipe ID
   *
   * @returns {void} Nothing
   */
  removeRecipe = (recipeName, recipeId) => {
    const { location } = this.props;
    const query = new URLSearchParams(location.search);
    const page = query.get('page');
    const limit = query.get('limit');

    this.props.deleteRecipe(recipeId)
      .then(() => {
        this.removeModal();
        if (_.size(this.props.recipe) === 0 && page > 0) {
          this.context.router.history
            .push(`${location.pathname}?page=${page - 1}&limit=${limit}`);
        }
        notify('success', `You have removed 
        <em><strong>${recipeName}</strong></em>`);
      })
      .catch((error) => {
        notify('error', error.response.data.message);
      });
  }

  /**
  * @description - Call Views for component rendering
  *
  * @returns {object} View - Rendered view
  *
  * @memberof Recipes
  */
  render() {
    const {
      imageUrl, name, description, ingredients, procedure
    } = this.state;
    return (
      <div className="body">
        <ManageRecipe
          modal={this.props.modal}
          recipe={{
            imageUrl, name, description, ingredients, procedure
          }}
          previewImage={this.state.previewImage}
          loading={this.state.isLoading}
          actions={{
            removeModal: this.removeModal,
            handleImageChange: this.handleImageChange,
            saveRecipe: this.saveRecipe,
            storeToState: this.storeToState,
            updateRecipe: this.updateRecipe
          }}
        />
        <Delete
          modalType="myrecipes"
          modal={this.props.modal}
          removeModal={this.removeModal}
          removeRecipe={this.removeRecipe}
          error={this.state.error}
        />
        <Header
          activePage="myrecipes"
        />
        <main>
          <div className="push-down">
            <View
              deleteRecipe={this.addModal}
              newRecipe={this.newRecipe}
              editRecipe={this.editRecipe}
              storeToState={this.storeToState}
              isLoading={this.state.isLoading}
              recipes={this.props.recipes}
              showDetails={this.showDetails}
              search={this.search}
              sought={this.state.sought}
              searchCategory={this.state.searchCategory}
            />
            <div className="flex">
              {
                _.size(this.props.recipes) > 0 && !this.state.isLoading ?
                  <Paginate
                    pageSize={`${Number(this.state.limit) || 10}`}
                    pagination={this.props.pagination}
                    onChange={this.onPageChange}
                    onShowSizeChange={this.onPageSizeChange}
                  /> : <div />
              }
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

MyRecipes.propTypes = {
  fetchMyRecipes: PropTypes.func.isRequired,
  addModal: PropTypes.func.isRequired,
  removeModal: PropTypes.func.isRequired,
  deleteRecipe: PropTypes.func.isRequired,
  editRecipe: PropTypes.func.isRequired,
  fetchRecipeDetails: PropTypes.func.isRequired,
  addRecipe: PropTypes.func.isRequired,
  recipes: PropTypes.shape().isRequired,
  recipe: PropTypes.shape().isRequired,
  pagination: PropTypes.shape().isRequired,
  modal: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired
};

MyRecipes.contextTypes = {
  router: PropTypes.object.isRequired
};

/**
 * @description - Maps data from redux state to component props
 *
 * @param {object} state - Redux state
 *
 * @returns {object} props - Mapped props
 */
const mapStateToProps = (state) => {
  const { recipe: { myRecipes, currentRecipe }, modal, auth } = state;
  return {
    pagination: myRecipes.pagination,
    recipes: myRecipes.recipes,
    modal: modal.modal,
    userId: auth.user.id,
    recipe: currentRecipe
  };
};

const actionCreators = {
  fetchMyRecipes,
  addModal,
  removeModal,
  deleteRecipe,
  addRecipe,
  fetchRecipeDetails,
  editRecipe,
  signOut
};

export default connect(mapStateToProps, actionCreators)(MyRecipes);
