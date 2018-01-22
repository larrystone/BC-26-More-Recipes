import React from 'react';
import RecipeItem from '../commons/RecipeItem';
import Samples from './Samples';

/**
 * @description - Stateless component for rendering SampleRecipes
 * on the landing page
 *
 * @returns {view} SampleRecipes - Rendered view
 */
function SampleRecipes() {
  return (
    <div className="full-width">
      <div className="full-title wow fadeIn">Sample Recipes</div>
      <div className="flex flex__wrap">
        {Samples.map(sample => (
          <RecipeItem
            key={sample.id}
            recipe={sample}
          />
        ))}
      </div>
    </div>
  );
}

export default SampleRecipes;
