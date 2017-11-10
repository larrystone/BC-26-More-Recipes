import React from 'react';
import {
  Loader, Message, Icon, Button, Label, Input, Card, Select
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import RecipeItem from '../views/RecipeItem';

const EMPTY = 0,
  options = [
    { key: 'recipes', text: 'by Name', value: 'recipes' },
    { key: 'ingredients', text: 'by Ingredient', value: 'ingredients' }
  ];

const RecipeHomeView = ({ itemActions, recipes, loggedUser,
  dashboardSection, searching, sought, mainActions }) => {
  const renderRecipes = () => {
    if (!recipes) {
      return (
        <Loader active
          style={{ marginTop: '40px' }}
          inline='centered'
          content='Fetching Great Recipes ' />
      );
    } else if (recipes.length === EMPTY) {
      return (
        <Message
          style={{ width: '100%', margin: '10px' }}
          color='green'
          size='large'>
          <Message.Header content='Nothing found!' />
          <Message.Content className="error">
            Sorry, no recipes found!!!
          </Message.Content>
        </Message>
      );
    } else {
      return (
        recipes.map((recipe) => {
          return (
            <RecipeItem
              dashboardSection={dashboardSection}
              actions={itemActions}
              key={recipe.id}
              recipe={recipe}
              username={loggedUser.username}
            />
          );
        })
      );
    }
  };

  const Header = () => {
    if (sought) {
      return (
        <div className="brand-logo">
          <div className="full-title">Search Results &nbsp;&nbsp;
              <Label as='a' color='teal'
              className="clickable"
              onClick={() => {
                mainActions.storeToState('sought', false);
                mainActions.fetchTopRecipes();
              }}
            >{recipes.length} found
              <Icon name='close' />
            </Label>
          </div>
          <div className="rounded-line"></div>
        </div>
      );
    } else {
      return (
        <div className="brand-logo">
          <div className="full-title">Top Picks</div>
          <div className="rounded-line"></div>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex-row">
        {Header()}
        <div>
          <Input
            loading={searching}
            type='text' placeholder='Search for recipe...' action
            disabled={searching}
            onChange={(event) => {
              mainActions.storeToState('searchTerm', event.target.value);
            }}>
            <input />
            <Select compact options={options} defaultValue='recipes'
              disabled={searching}
              onChange={(event, data) => {
                mainActions.storeToState('searchCategory', data.value);
              }}
            />
            <Button animated positive
              loading={searching}
              disabled={searching}
              onClick={() => { mainActions.handleSearch(); }}>
              <Button.Content hidden>Go</Button.Content>
              <Button.Content visible>
                <Icon name='search' />
              </Button.Content>
            </Button>
          </Input>
        </div>
      </div>
      <Card.Group>
        {renderRecipes()}
      </Card.Group>
    </div>
  );
};

RecipeHomeView.propTypes = {
  recipes: PropTypes.array,
  searching: PropTypes.bool,
  sought: PropTypes.bool,
  itemActions: PropTypes.object,
  dashboardSection: PropTypes.string,
  loggedUser: PropTypes.object,
  mainActions: PropTypes.object
};

export default RecipeHomeView;