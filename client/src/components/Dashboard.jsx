import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DashboardHeader from './DashboardHeader';
import Footer from './views/Footer';
import RecipeHome from './RecipeHome';
import MyRecipes from './MyRecipes';
import RecipeDetails from './RecipeDetails';
import CreatEditRecipe from './CreateEditRecipe';
import DeleteRecipe from './DeleteRecipe';
import MyFavorites from './MyFavorites';
import RemoveRecipe from './RemoveRecipe';
import Profile from './Profile';

class Dashboard extends Component {
  showDashboardSection() {
    const { dashboardSection } = this.props;
    if (dashboardSection === 'home') {
      return (
        <RecipeHome />
      );
    } else if (dashboardSection === 'my_recipes') {
      return (
        <MyRecipes />
      );
    } else if (dashboardSection === 'my_favs') {
      return (
        <MyFavorites />
      );
    } else if (dashboardSection === 'profile') {
      return (
        <Profile />
      );
    } else {
      return <div></div>;
    }
  }

  renderModals() {
    if (this.props.modal === 'recipe_details') {
      return <RecipeDetails />;
    } else if (this.props.modal === 'create_edit_recipe') {
      return <CreatEditRecipe />;
    } else if (this.props.modal === 'delete_recipe') {
      return <DeleteRecipe />;
    } else if (this.props.modal === 'remove_recipe') {
      return <RemoveRecipe />;
    } else {
      return <div></div>;
    }
  }

  render() {
    return (
      <div className='body'>
        <DashboardHeader />
        {this.renderModals()}
        <main>
          <div className="push-down">
            {this.showDashboardSection()}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dashboardSection: state.dashboard,
    modal: state.dialog
  };
};

Dashboard.propTypes = {
  modal: PropTypes.string,
  dashboardSection: PropTypes.string
};

export default connect(mapStateToProps, null)(Dashboard);