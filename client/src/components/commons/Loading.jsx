import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../../../images/loading.gif';

const Loading = ({ text }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ marginTop: '100px' }}>
      <img src={Loader} alt="" />
      <h3>
        <center className="wow infinite pulse">
          {`Loading ${text || ''}`}
        </center>
      </h3>
    </div>
  </div>
);

Loading.propTypes = {
  text: PropTypes.string
};

Loading.defaultProps = {
  text: ''
};

export default Loading;
