import React from 'react';
import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * @description - Stateless component for rendering no result
 *
 * @param {object} props - Props object
 *
 * @returns {view} NothingFound - Rendered view
 */
function NothingFound({ text }) {
  return (
    <Message
      className="not-found--message"
      color="green"
      size="large"
    >
      <Message.Header content="Nothing found!" />
      <Message.Content className="error">
        {`Sorry, ${text}`}
      </Message.Content>
    </Message>
  );
}

NothingFound.propTypes = {
  text: PropTypes.string
};

NothingFound.defaultProps = {
  text: 'nothing found here!!!'
};

export default NothingFound;
