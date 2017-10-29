import React from 'react';
import PropTypes from 'prop-types';

import HomeHeader from './HomeHeader';
import Footer from '../views/Footer';
import SignUpInContainer from '../containers/SignUpInContainer';
import AppIntro from '../views/AppIntro';
import SampleRecipes from '../views/SampleRecipes';

const HomeView = (
  {
    actions, dialogType,
    dashboardSection, recipes, loggedUser
  }
) => {
  return (
    <div className='body'>
      <HomeHeader
        setDialogType={actions.setDialogType}
      />
      <main>
        <SignUpInContainer
          setDialogType={actions.setDialogType}
          dialogType={dialogType}
        />
        <AppIntro />
        <SampleRecipes
          loggedUser={loggedUser}
          actions={actions}
          dashboardSection={dashboardSection}
          recipes={recipes} />
      </main>
      <Footer />
    </div>
  );
};

HomeView.propTypes = {
  recipes: PropTypes.array,
  actions: PropTypes.object,
  dialogType: PropTypes.string,
  dashboardSection: PropTypes.string,
  loggedUser: PropTypes.object
};

export default HomeView;