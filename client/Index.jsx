import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import jwt from 'jsonwebtoken';
import 'semantic-ui-css/semantic.min.css';

import setToken from './src/utils/setToken';
import { SET_CURRENT_USER } from './src/constants';

import reducers from './src/reducers';
import routes from './src/routes';

import './styles/index.scss';
import './styles/animate.css';
import './styles/toastr.css';

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension && process.env.NODE_ENV === 'development'
      ? window.devToolsExtension() : f => f
  )
);

if (localStorage.token) {
  setToken(localStorage.token);
  store.dispatch({
    type: SET_CURRENT_USER,
    userData: jwt.decode(localStorage.token)
  });
}

render(
  <Provider store={store}>
    <BrowserRouter>
      {routes}
    </BrowserRouter>
  </Provider>, document.querySelector('#root')
);

