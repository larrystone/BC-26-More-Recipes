import React from 'react';
import { shallow } from 'enzyme';
import Stats from './../../../../client/src/components/profile/Stats'; //eslint-disable-line

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<Stats {...props} />);
  }
  return mountedComponent;
};

describe('Component: Profile > Stats', () => {
  beforeEach(() => {
    props = {
      username: 'Lanestone',
      profile: {}
    };
    mountedComponent = undefined;
  });

  describe('Conditional rendering', () => {
    it('returns "No data to show"', () => {
      const cardContent = getComponent().find('center h5');
      expect(cardContent.props().children).toBe('No data to show');
    });

    it('renders a pie chart', () => {
      props.profile.myRecipes = 3;
      props.profile.myReviews = 2;
      props.profile.myFavs = 6;
      const cardContent = getComponent().find('Chart');
      expect(cardContent.length).toBe(1);
    });
  });
});
