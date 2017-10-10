import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import './scss/index.scss';

import reducer from './reducers';
import Home from './components/Home.jsx';

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Home />
  </Provider>, document.querySelector('#root')
);