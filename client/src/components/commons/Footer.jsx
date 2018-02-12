import React from 'react';

/**
 * @description - Stateless component for rendering the foooter
 *
 * @returns {view} FooterView - Rendered view
 */
function FooterView() {
  return (
    <footer
      className="footer"
    >
      <div className="flex-row flex__space-around">
        <div className="footer-item">
          <center>
            <h2>More-Recipes</h2>
            <div>
              <a href="https://github.com/larrystone/BC-26-More-Recipes">
                An Andela project
              </a>
            </div>
            <h5 className="sub-title">
              &copy; {`${new Date().getFullYear()}`} | Lawal Lanre (Larrystone)
            </h5>
          </center>
        </div>
      </div>
    </footer>
  );
}

export default FooterView;
