import React, { Component } from 'react';

import HomeHeader from './HomeHeader';
import Footer from './Footer';

class Home extends Component {
  render() {
    return (
      <div className='body'>
        <HomeHeader />
        <main>
          <center><span className="full-title">Featured Recipes</span></center>
          <div className="rounded-line" />
        </main>
        <Footer />
      </div>
    );
  }
}

export default Home;