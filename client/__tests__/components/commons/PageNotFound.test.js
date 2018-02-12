import React from 'react';
import { shallow } from 'enzyme';
import PageNotFound from './../../../../client/src/components/commons/PageNotFound';

describe('Component: PageNotFound', () => {
  it('renders properly', () => {
    const wrapper = shallow(<PageNotFound />);
    expect(wrapper).toMatchSnapshot();
  });
});
