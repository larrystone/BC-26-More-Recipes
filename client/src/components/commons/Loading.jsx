import React from 'react';
import PropTypes from 'prop-types';

import loading from '../../../images/loading.gif';

/**
 * @description - Stateless component for rendering custom app loader
 *
 * @param {object} props - props object
 *
 * @returns {view} Loading - Rendered view
 */
function Loading({ text }) {
  return (
    <div className="flex">
      <div className="loading--img">
        <img src={loading} alt="" />
        <h3>
          <center className="wow infinite pulse">
            {`Loading ${text || ''}`}
          </center>
        </h3>
      </div>
    </div>
  );
}

Loading.propTypes = {
  text: PropTypes.string
};

Loading.defaultProps = {
  text: ''
};

export default Loading;
