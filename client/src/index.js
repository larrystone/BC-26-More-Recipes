import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import './scss/index.scss';

import reducer from './reducers';
import Home from './components/Home.jsx';
import { verifyUser } from './helpers/jwt';

const store = createStore(reducer);

const TOKEN = 'more-recipe-token';

const authenticateUser = () => {
  const user = verifyUser();
  if (user) {
    store.dispatch(
      logUser(user)
    )
    return true;
  }

  bake_cookie(TOKEN, null);

  return false;
}

ReactDOM.render(
  <Provider store={store}>
    <Home />
  </Provider>, document.querySelector('#root')
);