import React from 'react';
import { shallow } from 'enzyme';
import Footer from './../../../../client/src/components/commons/Footer';

describe('Component: Footer', () => {
  it('renders properly', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper).toMatchSnapshot();
  });
});
