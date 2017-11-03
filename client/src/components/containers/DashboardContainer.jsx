import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DashboardHeaderView from '../views/DashboardHeaderView';
import Footer from '../views/Footer';
import RecipeHomeContainer from './RecipeHomeContainer';

import RecipeDetailsContainer from './RecipeDetailsContainer';

import { logUser } from '../../actions/user';
import { setDashboardSection } from '../../actions/dashboard';
import { setDialogType } from '../../actions/dialog';
import { setRecipe } from '../../actions/recipe';

// import MyRecipes from '../MyRecipes';
// import RecipeDetails from '../RecipeDetails';
import CreatEditRecipe from '../CreateEditRecipe';
import DeleteRecipe from '../DeleteRecipe';
// import MyFavorites from '../MyFavorites';
import RemoveRecipe from '../RemoveRecipe';
// import Profile from './Profile';

class Dashboard extends Component {
  showDashboardSection() {
    const { dashboardSection } = this.props;
    if (dashboardSection === 'home') {
      return (
        <RecipeHomeContainer
          dashboardSection={this.props.dashboardSection}
          loggedUser={this.props.loggedUser}
          actions={
            {
              setDialogType: this.props.setDialogType,
              setRecipe: this.props.setRecipe
            }
          }
        />
      );
    }
    // else if (dashboardSection === 'my_recipes') {
    //   return (
    //     <MyRecipes />
    //   );
    // } else if (dashboardSection === 'my_favs') {
    //   return (
    //     <MyFavorites />
    //   );
    // } else if (dashboardSection === 'profile') {
    //   return (
    //     <Profile />
    //   );
    // }
  }

  renderModals() {
    if (this.props.modal === 'recipe_details') {
      return (
        <RecipeDetailsContainer
          setDialogType={this.props.setDialogType}
          modal={this.props.modal}
          userId={this.props.loggedUser.id}
          recipe={this.props.recipe}
        />
      );
    } else if (this.props.modal === 'create_edit_recipe') {
      return <CreatEditRecipe />;
    } else if (this.props.modal === 'delete_recipe') {
      return <DeleteRecipe />;
    } else if (this.props.modal === 'remove_recipe') {
      return <RemoveRecipe />;
    }
  }

  render() {
    return (
      <div className='body'>
        <DashboardHeaderView
          {...this.props}
        />
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

Dashboard.propTypes = {
  modal: PropTypes.string,
  dashboardSection: PropTypes.string,
  loggedUser: PropTypes.object,
  setDashboardSection: PropTypes.func,
  setDialogType: PropTypes.func,
  setRecipe: PropTypes.func,
  recipe: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    loggedUser: state.user,
    dashboardSection: state.dashboard,
    modal: state.dialog,
    recipe: state.recipe
  };
};

const actionCreators = {
  logUser,
  setDashboardSection,
  setDialogType,
  setRecipe
};

export default connect(mapStateToProps, actionCreators)(Dashboard);