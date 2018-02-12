import React from 'react';
import { shallow } from 'enzyme';
import Routes from '../src/routes';

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<Routes {...props} />);
  }
  return mountedComponent;
};

describe('Routes', () => {
  it('successfully rendered', () => {
    expect(getComponent()).toMatchSnapshot();
  });
});
