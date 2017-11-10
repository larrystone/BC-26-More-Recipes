import React from 'react';
import {
  Card, Divider, Loader, Message,
  Accordion, Icon, Header
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import RecipeItem from './RecipeItem';

const ZERO = 0;

const MyFavorites = ({ recipes, activeIndex,
  actions, loggedUser, dashboardSection }) => {
  const renderRecipes = () => {
    if (!recipes) {
      return (
        <Loader active inline='centered' content='Fetching My Favorites...' />
      );
    } else if (recipes.length === ZERO) {
      return (
        <Message
          color='green'
          size='large'>
          <Message.Header content="Nothing found!" />
          <Message.Content className="error">
            Sorry, you have not marked any Recipes as favorites....
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
              recipe={recipe.Recipe}
              username={loggedUser.username}
            />
          );
        })
      );
    }
  };

  return (
    <div>
      <div className="brand-logo">
        <div className="full-title">My Favorite Recipes</div>
        <div className="rounded-line"></div>
      </div>
      <Accordion styled fluid>
        <Accordion.Title
          active={activeIndex === ZERO}
          index={ZERO}
          onClick={actions.handleAccordionClick}>
          <Icon name='dropdown' />
          <Header as={'span'}>General</Header>
          <Divider />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === ZERO}>
          <Card.Group>
            {renderRecipes()}
          </Card.Group>
        </Accordion.Content>
      </Accordion>
    </div>
  );
};

MyFavorites.propTypes = {
  activeIndex: PropTypes.number,
  recipes: PropTypes.array,
  loggedUser: PropTypes.object,
  actions: PropTypes.object,
  dashboardSection: PropTypes.string
};

export default MyFavorites;