import { DASHBOARD_SECTION } from '../constants';

let section = 'home';

export default (state = section, action) => {
  if (action.type === DASHBOARD_SECTION) {
    const { newSection } = action;
    section = newSection;
    return section;
  }
  return state;
};