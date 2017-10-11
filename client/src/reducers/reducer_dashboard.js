import { DASHBOARD_SECTION } from '../constants';

let section = 'home';

export default (state = section, action) => {
  switch (action.type) {
    case DASHBOARD_SECTION:
      const { newSection } = action;
      section = newSection;
      return section;
    default:
      return state;
  }
}