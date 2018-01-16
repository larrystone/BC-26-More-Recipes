import React from 'react';
import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * Stateless component for rendering no result
 *
 * @param {object} props
 * @returns {view} NothingFound
 */
const NothingFound = ({ text }) => (
  <Message
    style={{ width: '95%', margin: '10px auto' }}
    color="green"
    size="large"
  >
    <Message.Header content="Nothing found!" />
    <Message.Content className="error">
      {`Sorry, ${text}`}
    </Message.Content>
  </Message>
);

NothingFound.propTypes = {
  text: PropTypes.string
};

NothingFound.defaultProps = {
  text: 'nothing found here!!!'
};

export default NothingFound;
