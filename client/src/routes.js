import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './components/Home';
import Recipes from './components/recipes';
import Footer from './components/commons/Footer';

const generalRoutes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Redirect to="/" />
  </Switch>
);

const protectedRoutes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/recipes" component={Footer} />
    <Route path="/recipes/search" component={Recipes} />
    <Redirect to="/" />
  </Switch>
);

export default (
  localStorage.getItem('token') ? protectedRoutes : generalRoutes
);
