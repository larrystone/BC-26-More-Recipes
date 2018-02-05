import React from 'react';
import { shallow } from 'enzyme';
import Authenticate from '../../src/utils/requireAuth';
import Footer from '../../src/components/commons/Footer';
import localStorageMock from '../../__mocks__/localStorageMock';

const components = Authenticate(Footer);

const { WrappedComponent } = components;

window.localStorage = localStorageMock;

let props;
let mountedComponent;

jest.dontMock('jsonwebtoken');

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<WrappedComponent {...props} />);
  }
  return mountedComponent;
};

describe('Component: Authenticate', () => {
  beforeEach(() => {
    props = {
      signOut: () => Promise.resolve()
    };
    mountedComponent = undefined;
  });

  describe('ComponentWillMount() > calls signOut() when', () => {
    it('no token found', () => {
      expect(getComponent()).toMatchSnapshot();
    });

    it('error decoding token', () => {
      localStorage.setItem('token', 'sssshbsisgvsyids');
      expect(getComponent()).toMatchSnapshot();
    });

    it('token has expired', () => {
      process.env.NODE_ENV = process.env.JWT_SECRET;
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJsYXJyeXN0b25lMSIsImV4cCI6MTUxODExNzA0OSwiaWF0IjoxNTE4MTE3MDQ5fQ.o6GrFfzyCPXloU7lGEBYVzobH50aRuYlHLbYyQqzZwk'); //eslint-disable-line
      expect(getComponent()).toMatchSnapshot();
    });
  });
});
