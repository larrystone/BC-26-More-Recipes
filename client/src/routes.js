import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './components/Home';
import AllRecipes from './components/allrecipes';

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
    <Redirect to="/" />
  </Switch>
);

export default (
  localStorage.getItem('token') ? protectedRoutes : generalRoutes
);
