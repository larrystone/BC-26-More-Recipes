import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import RecipeItem from '../commons/RecipeItem';
import Loading from '../commons/Loading';
import NothingFound from '../commons/NothingFound';

/**
 * @description - Stateless component for rendering favorite recipes
 *
 * @param {object} props - Component's props
 *
 * @returns {view} View - Rendered view
 */
function View({
  isLoading, recipes, showDetails, addModal
}) {
  if (isLoading) {
    return (
      <Loading
        text="my favorites"
      />
    );
  }
  if (_.size(recipes) === 0) {
    return (
      <div>
        <NothingFound />
      </div>
    );
  }
  return (
    <div>
      <div className="full-title wow fadeIn">
        {'My Favorites'}
      </div>
      <div className="flex flex__wrap">
        {Object.keys(recipes).map(index => (
          <RecipeItem
            isFav
            key={index}
            recipe={recipes[index]}
            actions={{
              showDetails,
              deleteFav: addModal
            }}
          />
        ))}
      </div>
    </div>
  );
}

View.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  recipes: PropTypes.shape().isRequired,
  showDetails: PropTypes.func.isRequired,
  addModal: PropTypes.func.isRequired
};

export default View;
