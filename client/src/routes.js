import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './components/Home';
import AllRecipes from './components/AllRecipes';
import RecipeDetails from './components/RecipeDetails';
import MyRecipes from './components/MyRecipes';
import MyFavorites from './components/Favorites';
import Profile from './components/Profile';

import requireAuth from './utils/requireAuth';

const routes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/recipes" component={requireAuth(AllRecipes)} />
    <Route exact path="/myrecipes" component={requireAuth(MyRecipes)} />
    <Route path="/recipe/:id" component={requireAuth(RecipeDetails)} />
    <Route path="/favorites" component={requireAuth(MyFavorites)} />
    <Route path="/profile/:userId" component={requireAuth(Profile)} />
    <Redirect to="/" />
  </Switch>
);

export default (
  routes
);
