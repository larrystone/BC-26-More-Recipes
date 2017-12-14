import React from 'react';
import RecipeItem from '../RecipeItem';
import SampleRecipes from '../../SampleRecipes';

const SampleRecipesView = () => (
  <div>
    <div className="full-title wow fadeIn">Sample Recipes</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {SampleRecipes.map(sample => (
        <RecipeItem
          key={sample.id}
          recipe={sample}
        />
      ))}
    </div>
  </div>
);

export default SampleRecipesView;
