import React from 'react';
import { mount } from 'enzyme';
import Loading from './../../../../client/src/components/commons/Loading.jsx';

let props;
let mountedLoading;

/**
 * @description Initialise the component
 *
 * @returns {View} Loading - Mounted component
 */
const getComponent = () => {
  if (!mountedLoading) {
    mountedLoading = mount(
      <Loading {...props} />
    );
  }
  return mountedLoading;
};

describe('Component: Loading', () => {
  beforeEach(() => {
    props = {
      text: undefined,
    };
    mountedLoading = undefined;
  });

  it('receives one prop', () => {
    expect(Object.keys(getComponent().props()).length).toBe(1);
  });

  describe('when `text` is passed', () => {
    it('append that text to `Loading ` message', () => {
      props.text = 'Fried Rice';

      const wrappingDiv = getComponent().find('center').first();
      expect(wrappingDiv.props().children).toBe(`Loading ${props.text}`);
    });
  });

  describe('when `text` is not passed', () => {
    it('appends nothing to `Loading ` message', () => {
      props.text = undefined;

      const wrappingDiv = getComponent().find('center').first();
      expect(wrappingDiv.props().children).toBe('Loading ');
    });
  });
});
