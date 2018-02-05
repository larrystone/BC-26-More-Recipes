import React from 'react';
import { mount } from 'enzyme';
import Paginate from './../../../../client/src/components/commons/Paginate'; //eslint-disable-line

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} getComponent - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = mount(
      <Paginate {...props} />
    );
  }
  return mountedComponent;
};

describe('Component: Paginate', () => {
  beforeEach(() => {
    props = {
      onChange: () => { },
      onShowSizeChange: () => { },
      pagination: {
        currentPage: 1
      },
      pageSize: '1',
      showTotal: jest.fn()
    };
    mountedComponent = undefined;
  });

  it('renders correctly', () => {
    const divs = getComponent().find('Pagination');
    expect(divs.first().length).toBeGreaterThan(0);
    expect(divs.props().pageSize).toBe(1);
  });

  describe('PageSize', () => {
    describe('set pageSize to', () => {
      it('0 when null value passed', () => {
        props.pageSize = null;
        const divs = getComponent().find('Pagination');
        expect(divs.props().pageSize).toBe(0);
      });
    });
  });
});
