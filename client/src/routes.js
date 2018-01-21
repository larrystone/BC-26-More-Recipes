import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './components/Home';
import AllRecipes from './components/AllRecipes';
import RecipeDetails from './components/RecipeDetails';
import MyRecipes from './components/MyRecipes';
import MyFavorites from './components/Favorites';
import Profile from './components/Profile';

const generalRoutes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Redirect to="/" />
  </Switch>
);

const protectedRoutes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/recipes" component={AllRecipes} />
    <Route exact path="/myrecipes" component={MyRecipes} />
    <Route path="/recipe/:id" component={RecipeDetails} />
    <Route path="/favorites" component={MyFavorites} />
    <Route path="/profile/:userId" component={Profile} />
    <Redirect to="/" />
  </Switch>
);

export default (
  localStorage.getItem('token') ? protectedRoutes : generalRoutes
);
