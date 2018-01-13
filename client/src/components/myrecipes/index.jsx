import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toastr from 'toastr';
import _ from 'lodash';

import Header from '../header';
import View from './view';
import Paginate from '../commons/Paginate';
import Footer from '../commons/Footer';
import Delete from '../commons/Delete';
import CreateOrEdit from '../commons/CreateOrEdit';

import {
  fetchMyRecipes, deleteRecipe, addRecipe, editRecipe, fetchRecipeDetails
} from '../../actions/recipeActions';
import { addModal, removeModal } from '../../actions/modalActions';
import { signOut } from '../../actions/authActions';

/**
 * My recipes container with pagination
 *
 * @class Recipes
 * @extends {Component}
 * @param {string} newPage - selected page
 * @param {string} pageSize - Max number of items on a page
 * @param {string} nextPage - Next page
 * @param {number} recipeId - Recipe Id
 */
class MyRecipes extends Component {
  /**
   * Creates an instance of Recipes.
   * @param {any} props
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
      procedure: ''
    };
  }

  /**
   * Fetches recipes based on page and limit
   * parameters when components loads
   *
   * @memberof Recipes
   * @returns {void} Null
   */
  componentWillMount() {
    const { location } = this.props;
    this.fetchRecipes(location);
  }

  /**
   * Fetches recipes when pagination events occur
   *
   * @param {any} nextProps
   * @memberof MyRecipes
   * @returns {void} Null
   */
  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (this.props.location.search !== location.search) {
      this.fetchRecipes(location);
    }
  }

  onPageSizeChange = (selectedPage, pageSize) => {
    const { url } = this.state;
    this.context.router.history
      .push(`${url}page=${selectedPage}&limit=${pageSize}`);
  };

  onPageChange = (newPage) => {
    const { url, limit } = this.state;
    this.context.router.history.push(`${url}page=${newPage}&limit=${limit}`);
  };

  showDetails = (recipeId) => {
    this.context.router.history.push(`/recipe/${recipeId}`);
  }

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

  storeToState = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  /**
   * Parse the location object
   * and fetch the recipes
   *
   * @param {any} location
   * @memberof MyRecipes
   * @returns {void} Null
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
        Toastr.error(error.response.data.message);
        this.props.signOut();
      });
  }

  saveRecipe = () => {
    const data = new FormData();

    const {
      imageUrl, name, description, ingredients, procedure
    } = this.state;

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
        Toastr.success(`New recipe created <br/>${name}`);
        this.removeModal();
      })
      .catch((error) => {
        Toastr.clear();
        this.setState({
          isLoading: false
        });
        const { data: { message } } = error.response;
        Toastr.error(message);
      });
  }

  updateRecipe = (recipeId) => {
    const data = new FormData();

    const {
      imageUrl, name, description, ingredients, procedure
    } = this.state;

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
        Toastr.success(`Recipe updated <br/>${name}`);
        this.removeModal();
      })
      .catch((error) => {
        Toastr.clear();
        this.setState({
          isLoading: false
        });
        const { data: { message } } = error.response;
        Toastr.error(message);
      });
  }

  addModal = (recipeName, recipeId, modalType) => {
    this.props.addModal({
      type: modalType,
      recipeName,
      recipeId
    });
  }

  newRecipe = (recipeName, recipeId, modalType) => {
    this.setState({
      imageUrl: '',
      name: '',
      description: '',
      ingredients: '',
      procedure: '',
      previewImage: ''
    });
    this.addModal(recipeName, recipeId, modalType);
  }

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

  removeModal = () => {
    this.props.removeModal();
  }

  removeRecipe = (recipeName, recipeId) => {
    this.props.deleteRecipe(recipeId)
      .then(() => {
        this.removeModal();
        Toastr
          .success(`You have removed <em><strong>${recipeName}</strong></em>`);
      })
      .catch((error) => {
        Toastr
          .error(error.response.data.message);
      });
  }

  /**
  * Call Views for component rendering
  *
  * @returns {object} View
  * @memberof Recipes
  */
  render() {
    const {
      imageUrl, name, description, ingredients, procedure
    } = this.state;
    return (
      <div className="body">
        <CreateOrEdit
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
              addModal={this.newRecipe}
              editRecipe={this.editRecipe}
              storeToState={this.storeToState}
              isLoading={this.state.isLoading}
              recipes={this.props.recipes}
              showDetails={this.showDetails}
              search={this.search}
              sought={this.state.sought}
              searchCategory={this.state.searchCategory}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {
                _.size(this.props.recipes) > 0 ?
                  <Paginate
                    pageSize={`${this.state.limit}`}
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
  signOut: PropTypes.func.isRequired,
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
