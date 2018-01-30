import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';

import RecipeItem from '../commons/RecipeItem';
import Loading from '../commons/Loading';
import NothingFound from '../commons/NothingFound';

/**
 * @description - Stateless component for rendering user owned recipes
 *
 * @param {object} props - Component's props
 *
 * @returns {view} View - Rendered view
 */
function View({
  isLoading, recipes, showDetails, deleteRecipe, newRecipe, editRecipe
}) {
  /**
   * @description - Renders the new recipe button
   *
   * @returns {view} Button - Rendered button
   */
  const renderAddRecipe = () => (
    <div className="flex">
      <div className="auto__left">
        <Button
          size="huge"
          label="New Recipe"
          labelPosition="right"
          circular
          icon="plus"
          color="brown"
          onClick={() => {
            newRecipe('create_edit_recipe');
          }}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Loading
        text="Recipes"
      />
    );
  }
  if (_.size(recipes) === 0) {
    return (
      <div>
        <NothingFound />
        {renderAddRecipe()}
      </div>
    );
  }
  return (
    <div>
      <div className="full-title wow fadeIn">
        {'My Recipes'}
      </div>
      {renderAddRecipe()}
      <div className="flex flex__wrap">
        {Object.values(recipes)
          .sort((first, next) => next.id - first.id)
          .map(recipe => (
            <RecipeItem
              key={recipe.id}
              loggedIn
              isAdmin
              actions={{
                showDetails,
                deleteRecipe,
                editRecipe
              }}
              recipe={recipe}
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
  editRecipe: PropTypes.func.isRequired,
  deleteRecipe: PropTypes.func.isRequired,
  newRecipe: PropTypes.func.isRequired
};

export default View;
