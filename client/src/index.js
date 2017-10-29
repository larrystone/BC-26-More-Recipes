import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { bake_cookie } from 'sfcookies';
import { Router, Switch, Route, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';

import './scss/index.scss';

import reducer from './reducers';
import { logUser } from './actions/user';

import HomeContainer from './components/containers/HomeContainer.jsx';
import Dashboard from './components/Dashboard';

import { verifyUser } from './helpers/jwt';

const store = createStore(reducer);

const TOKEN = 'more-recipe-token';

const authenticateUser = () => {
  const user = verifyUser();
  if (user) {
    store.dispatch(
      logUser(user)
    );
    return true;
  }

  bake_cookie(TOKEN, null);

  return false;
};

const getRoutes = () => {
  if (authenticateUser()) {
    return (
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <Route path="/dashboard" component={Dashboard} />
        <Redirect to='/' />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <Redirect to='/' />
      </Switch>
    );
  }
};

ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      {getRoutes()}
    </Router>
  </Provider>, document.querySelector('#root')
);