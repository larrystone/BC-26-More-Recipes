import React from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import RecipeItem from './RecipeItem';

const SampleRecipes = ({ recipes, actions, dashboardSection, loggedUser }) => {
  return (
    <div>
      <div className="full-title">Sample Recipes</div>
      <div className="rounded-line" />
      <Card.Group>
        {
          recipes.map(sample => (
            <RecipeItem
              key={sample.id}
              recipe={sample}
              dashboardSection={dashboardSection}
              actions={actions}
              username={loggedUser.username}
            />
          ))
        }
      </Card.Group>
    </div>
  );
};

SampleRecipes.propTypes = {
  recipes: PropTypes.array,
  actions: PropTypes.object,
  dashboardSection: PropTypes.string,
  loggedUser: PropTypes.object
};

export default SampleRecipes;