import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Header from '../header';
import View from './view';
import Paginate from '../commons/Paginate';
import Footer from '../commons/Footer';

import { fetchPagedRecipe, searchRecipe } from '../../actions/recipeActions';

/**
 * Top recipe container with pagination
 *
 * @class Recipes
 * @extends {Component}
 * @param {string} page - selected page
 * @param {string} pageSize - Max number of items on a page
 * @param {string} key
 * @param {string} value
 */
class Recipes extends Component {
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
      searchCategory: 'name',
      searchString: '',
      sought: false
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
   * Fetches recipes based on page and limit
   * parameters when components page changes
   *
   * @memberof Recipes
   * @param {object} nextProps - The new prop
   * @returns {void} Null
   */
  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;

    if (this.props.location.search !== location.search) {
      this.fetchRecipes(location);
    }
  }

  /**
   * Handles fetching recipe on new page size request
   *
   * @memberof Recipes
   * @param {number} currentPage
   * @param {number} pageSize
   * @returns {null} Nothing
   */
  onPageSizeChange = (currentPage, pageSize) => {
    const { url } = this.state;
    this.context.router.history
      .push(`${url}page=${currentPage}&limit=${pageSize}`);
  }

  /**
   * Handles fetching recipe on new page request
   *
   * @memberof Recipes
   * @param {number} newPage
   * @returns {null} Nothing
   */
  onPageChange = (newPage) => {
    const { url, limit } = this.state;
    this.context.router.history
      .push(`${url}page=${newPage}&limit=${limit}`);
  }

  /**
   * Fetches recipes based on page and query parameters
   * from the location object
   *
   * @param {any} location
   * @memberof Recipes
   * @returns {null} Nothing
   */
  fetchRecipes(location) {
    const query = new URLSearchParams(location.search);
    const page = query.get('page');
    const limit = query.get('limit');
    const searchCategory = query.get('by');
    const searchString = query.get('text');

    this.setState({
      url: `${location.pathname}?`,
      isLoading: true,
      limit: limit || 10
    });

    if (searchCategory) {
      this.setState({
        url: `${location.pathname}?by=${searchCategory}&text=${searchString}&`,
        searchCategory,
        searchString
      });
      this.props.searchRecipe(searchCategory, searchString, page, limit)
        .then(() => {
          this.setState({
            isLoading: false,
            sought: true
          });
        });
    } else {
      this.props.fetchPagedRecipe(page, limit)
        .then(() => {
          this.setState({
            isLoading: false,
            sought: false
          });
        });
    }
  }

  /**
   * Stores value to component's state
   *
   * @memberof Recipes
   * @param {string} key
   * @param {string} value
   * @returns {null} Nothing
   */
  storeToState = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  search = () => {
    const { searchCategory, searchString, limit } = this.state;
    if (searchString.length > 0) {
      this.context.router.history.push(`/recipes?by=${searchCategory}&` +
        `text=${searchString}&page=1&limit=${limit}`);
    }
  }

  /**
   * Calls the route that allow recipe detail to viewed
   *
   * @memberof Recipes
   * @param {number} recipeId
   * @returns {null} Nothing
   */
  showDetails = (recipeId) => {
    this.context.router.history.push(`/recipe/${recipeId}`);
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
        <Header
          activePage={this.state.sought ? '' : 'home'}
        />
        <main>
          <div className="push-down">
            <View
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

Recipes.propTypes = {
  searchRecipe: PropTypes.func.isRequired,
  fetchPagedRecipe: PropTypes.func.isRequired,
  recipes: PropTypes.shape().isRequired,
  pagination: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired
};

Recipes.contextTypes = {
  router: PropTypes.object.isRequired
};

/**
 * Maps state to a props object
 *
 * @param {any} state
 * @returns {object} props
 */
const mapStateToProps = (state) => {
  const { allRecipes } = state.recipe;
  return {
    pagination: allRecipes.pagination,
    recipes: allRecipes.recipes
  };
};

const actionCreators = { fetchPagedRecipe, searchRecipe };

export default connect(mapStateToProps, actionCreators)(Recipes);
