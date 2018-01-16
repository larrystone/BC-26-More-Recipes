import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash';

import RecipeItem from '../commons/RecipeItem';
import Loading from '../commons/Loading';
import NothingFound from '../commons/NothingFound';

const options = [
  { key: 'name', text: 'Name', value: 'name' },
  { key: 'ingredients', text: 'Ingredient', value: 'ingredients' },
  { key: 'search', text: 'All', value: 'search' }
];


/**
 * All recipes Stateless view component
 *
 * @param {object} props
 * @returns {view} View
 */
const View = ({
  isLoading, recipes, storeToState, search, searchCategory, sought, showDetails
}) => {
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Input
            type="text"
            placeholder="Search for recipe by..."
            action
            onChange={(event) => {
              storeToState('searchString', event.target.value);
            }}
          >
            <input />
            <Select
              style={{ width: '100px' }}
              compact
              options={options}
              value={searchCategory}
              onChange={(event, data) => {
                storeToState('searchCategory', data.value);
              }}
            />
            <Button
              animated
              positive
              onClick={() => {
                search();
              }}
            >
              <Button.Content hidden>Go</Button.Content>
              <Button.Content visible>
                <Icon name="search" />
              </Button.Content>
            </Button>
          </Input>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Input
          style={{ marginLeft: 'auto' }}
          type="text"
          placeholder="Search for recipe by..."
          action
          onChange={(event) => {
            storeToState('searchString', event.target.value);
          }}
        >
          <input />
          <Select
            style={{ width: '100px' }}
            compact
            options={options}
            value={searchCategory}
            onChange={(event, data) => {
              storeToState('searchCategory', data.value);
            }}
          />
          <Button
            animated
            positive
            onClick={() => {
              search();
            }}
          >
            <Button.Content hidden>Go</Button.Content>
            <Button.Content visible>
              <Icon name="search" />
            </Button.Content>
          </Button>
        </Input>
      </div>
      <div className="full-title wow fadeIn">
        {sought ?
          'Search Results' : 'Top Picks'
        }
      </div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {Object.values(recipes)
          .sort((first, next) => next.upvotes - first.upvotes)
          .map(recipe => (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
              actions={{
                showDetails
              }}
            />
          ))}
      </div>
    </div>
  );
};

View.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  recipes: PropTypes.shape().isRequired,
  storeToState: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchCategory: PropTypes.string.isRequired,
  sought: PropTypes.bool.isRequired,
  showDetails: PropTypes.func.isRequired
};

export default View;
