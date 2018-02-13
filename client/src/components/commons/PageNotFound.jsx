import React from 'react';
import Footer from './Footer';
import zero from '../../../images/zero.svg';

/**
 * @description - Stateless component for rendering a 404 page
 *
 * @returns {view} PageNotFound - Rendered view
 */
function PageNotFound() {
  return (
    <div className="body">
      <header id="not-found">
        <center>
          <a href="/" className="brand-logo">
            More-Recipes
          </a>
        </center>
      </header >
      <main>
        <div className="push-down">
          <div className="not-found">
            <h1>4</h1>
            <img src={zero} alt="" />
            <h1>4</h1>
          </div>
          <center>
            <h2>Oh no...the page you requested was not found</h2>
            <a className="ui brown large button" href="/">
              &gt;&gt; Home &lt;&lt;
            </a>
          </center>
        </div>
      </main>
      <Footer />
    </div >
  );
}

export default PageNotFound;
