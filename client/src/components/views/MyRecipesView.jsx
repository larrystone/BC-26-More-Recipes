import React from 'react';
import { Card, Loader, Message, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import RecipeItem from '../views/RecipeItem';

const EMPTY = 0;

const MyRecipesView = ({ actions, recipes,
  dashboardSection, loggedUser }) => {
  const renderRecipes = () => {
    if (!recipes) {
      return (
        <Loader active inline='centered' content='Fetching My Recipes' />
      );
    } else if (recipes.length === EMPTY) {
      return (
        <Message
          style={{ width: '100%', margin: '10px' }}
          color='green'
          size='large'>
          <Message.Header content="Nothing found!" />
          <Message.Content className="error">
            Sorry, you have not created any Recipes....
          </Message.Content>
        </Message>
      );
    } else {
      return (
        recipes.map((recipe) => {
          return (
            <RecipeItem
              dashboardSection={dashboardSection}
              actions={actions}
              key={recipe.id}
              recipe={recipe}
              username={loggedUser.username}
            />
          );
        })
      );
    }
  };

  return (
    <div>
      <div className="flex-row">
        <div className="brand-logo">
          <div className="full-title">My Recipes</div>
          <div className="rounded-line"></div>
        </div>
        <Button
          label='New Recipe'
          labelPosition='right'
          circular
          icon='plus'
          color='teal'
          onClick={() => {
            actions
              .setRecipe({
                id: null,
                name: null
              });
            actions.setDialogType('create_edit_recipe');
          }}
        />
      </div>
      <Card.Group>
        {renderRecipes()}
      </Card.Group>
    </div>
  );
};

MyRecipesView.propTypes = {
  recipes: PropTypes.array,
  actions: PropTypes.object,
  dashboardSection: PropTypes.string,
  loggedUser: PropTypes.object
};

export default MyRecipesView;