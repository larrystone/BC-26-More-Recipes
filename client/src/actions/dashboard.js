import { DASHBOARD_SECTION } from '../constants';

export const setDashboardSection = (newSection) => {
  const action = {
    type: DASHBOARD_SECTION,
    newSection
  };
  return action;
};