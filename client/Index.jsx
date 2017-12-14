import React from 'react';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './styles/index.scss';
import './styles/animate.css';

// import './styles/toastr.min.css';

// import reducer from './src/reducers';

import Home from './src/components/Home';
// import DashboardContainer from './src/components/containers/DashboardContainer';

// const store = createStore(
//   reducer,
//   compose(
//     applyMiddleware(thunk)
//     // window.devToolsExtension ? window.devToolsExtension() : f => f
//   )
// );

render(

  // <Provider store={store}>
  //   <BrowserRouter>
  //     <Switch>
  //       <Route exact path="/" component={HomeContainer} />
  //       <Route path="/dashboard" component={DashboardContainer} />
  //       <Redirect to="/" />
  //     </Switch>
  //   </BrowserRouter>
  // </Provider>
  <Home />, document.querySelector('#root')
);
