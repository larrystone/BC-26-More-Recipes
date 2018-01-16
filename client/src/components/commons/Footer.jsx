import React from 'react';

/**
 * Stateless component for rendering the foooter
 *
 * @returns {view} FooterView
 */
const FooterView = () => (
  <footer style={{ padding: '15px 0px' }}>
    <div className="flex-row" style={{ justifyContent: 'space-around' }}>
      <div className="footer-item">
        <h2>More-Recipes...</h2>
        <h4>An Andela Bootcamp LOS/26 project</h4>
        <h5>&copy; 2017 Lawal Lanre (Larrystone)</h5>
      </div>
      <div className="footer-item">
        <h2>Project links</h2>
        <div>
          <a href="https://github.com/larrystone/BC-26-More-Recipes">
            Github
          </a>
        </div>
        <div>
          <a href="https://www.pivotaltracker.com/n/projects/2096195">
            Pivotal Tracker
          </a>
        </div>

      </div>
    </div>
  </footer>
);

export default FooterView;
