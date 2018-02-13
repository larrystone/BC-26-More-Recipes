import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import AllRecipes from './components/allrecipes';
import RecipeDetails from './components/recipedetails';
import MyRecipes from './components/myrecipes';
import Favorites from './components/favorites';
import Profile from './components/profile';
import PageNotFound from './components/commons/PageNotFound';

import requireAuth from './utils/requireAuth';

/**
 * @description Routes component
 *
 * @returns {object} routes
 *
 */
const routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/recipes" component={requireAuth(AllRecipes)} />
    <Route exact path="/myrecipes" component={requireAuth(MyRecipes)} />
    <Route path="/recipe/:id" component={requireAuth(RecipeDetails)} />
    <Route path="/favorites" component={requireAuth(Favorites)} />
    <Route path="/profile/:userId" component={requireAuth(Profile)} />
    <Route path="/*" component={PageNotFound} />
  </Switch>
);

export default (
  routes
);
