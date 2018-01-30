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
 * @description - All recipes Stateless view component
 *
 * @param {object} props - Internal props object
 *
 * @returns {view} View - Rendered view
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
        <div className="flex">
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
              compact
              options={options}
              value={searchCategory}
              onChange={(event, data) => {
                storeToState('searchCategory', data.value);
              }}
            />
            <Button
              animated
              color="brown"
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
      <div className="flex">
        <Input
          className="auto__left"
          type="text"
          placeholder="Search for recipe by..."
          action
          onChange={(event) => {
            storeToState('searchString', event.target.value);
          }}
        >
          <input />
          <Select
            compact
            options={options}
            value={searchCategory}
            onChange={(event, data) => {
              storeToState('searchCategory', data.value);
            }}
          />
          <Button
            animated
            color="brown"
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
        className="flex flex__wrap"
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
