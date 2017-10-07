import React, { Component } from 'react';

import HomeHeader from './HomeHeader';

class Home extends Component {
  render() {
    return (
      <div>
        <HomeHeader />

        <div className="recipes">
          <center><span className="full-title">Featured Recipes</span></center>
          <div className="rounded-line" />
        </div>
      </div>
    );
  }
}

export default Home;