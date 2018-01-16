import React from 'react';
import RecipeItem from '../commons/RecipeItem';
import Samples from './Samples';

/**
 * Stateless component for rendering SampleRecipes
 * on the landing page
 *
 * @param {object} props
 * @returns {view} SampleRecipes
 */
const SampleRecipes = () => (
  <div style={{ width: '100%' }}>
    <div className="full-title wow fadeIn">{'Sample Recipes'}</div>
    <div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {Samples.map(sample => (
        <RecipeItem
          key={sample.id}
          recipe={sample}
        />
      ))}
    </div>
  </div>
);

export default SampleRecipes;
