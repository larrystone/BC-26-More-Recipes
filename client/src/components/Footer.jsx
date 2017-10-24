import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className='flex-row'>
        <div className='footer-item'>
          <h5>More-Recipes...</h5>
          <p>An Andela Bootcamp LOS/26 project</p>
        </div>
        <div className='footer-item'>
          <h5>Project links</h5>
          <ul>
            <li>
              <a href="https://github.com/larrystone/BC-26-More-Recipes">
                Github
              </a>
            </li>
            <li>
              <a href="https://www.pivotaltracker.com/n/projects/2096195">
                Pivotal Tracker
            </a>
            </li>
          </ul>
        </div>
      </div>
      <h6><center>&copy; 2017 Lanre Lawal E. (Larrystone)</center></h6>
    </footer>
  );
};

export default Footer;