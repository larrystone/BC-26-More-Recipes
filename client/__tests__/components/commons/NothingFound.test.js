import React from 'react';
import mount from 'enzyme/mount';
import NothingFound from './../../../../client/src/components/commons/NothingFound'; //eslint-disable-line

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {View} Loading - Mounted component
 */
const loading = () => {
  if (!mountedComponent) {
    mountedComponent = mount(
      <NothingFound {...props} />
    );
  }
  return mountedComponent;
};

describe('Component: NothingFound', () => {
  beforeEach(() => {
    props = {
      text: undefined,
    };
    mountedComponent = undefined;
  });

  it('receives one prop', () => {
    expect(Object.keys(loading().props()).length).toBe(1);
  });

  describe('Message Content', () => {
    it('append provided text to `Sorry, ` message', () => {
      props.text = 'you are not here';
      const wrappingDiv = loading().find('MessageContent');
      expect(wrappingDiv.props().children).toBe(`Sorry, ${props.text}`);
    });

    it('append default text to `Sorry ` message when no text provided', () => {
      props.text = undefined;
      const wrappingDiv = loading().find('MessageContent');
      expect(wrappingDiv.props().children).toBe('Sorry, nothing found here!!!');
    });
  });
});
