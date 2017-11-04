import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DashboardHeaderView from '../views/DashboardHeaderView';
import Footer from '../views/Footer';
import RecipeHomeContainer from './RecipeHomeContainer';
import MyRecipesContainer from './MyRecipesContainer';
import MyFavoritesContainer from './MyFavoritesContainer';
import ProfileContainer from './ProfileContainer';

import { logUser } from '../../actions/user';
import { setDashboardSection } from '../../actions/dashboard';
import { setDialogType } from '../../actions/dialog';
import { setRecipe } from '../../actions/recipe';
import { setReloadRecipes } from '../../actions/reload_recipe';

import RecipeDetailsContainer from './RecipeDetailsContainer';
import CreatEditRecipeContainer from './CreateEditRecipeContainer';
import DeleteRecipeContainer from './DeleteRecipeContainer';
import RemoveRecipeContainer from './RemoveRecipeContainer';

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
    } else if (dashboardSection === 'my_recipes') {
      return (
        <MyRecipesContainer
          dashboardSection={this.props.dashboardSection}
          loggedUser={this.props.loggedUser}
          reloadRecipes={this.props.reloadRecipes}
          actions={
            {
              setDialogType: this.props.setDialogType,
              setRecipe: this.props.setRecipe,
              setReloadRecipes: this.props.setReloadRecipes
            }
          } />
      );
    } else if (dashboardSection === 'my_favs') {
      return (
        <MyFavoritesContainer
          dashboardSection={this.props.dashboardSection}
          loggedUser={this.props.loggedUser}
          reloadRecipes={this.props.reloadRecipes}
          actions={
            {
              setDialogType: this.props.setDialogType,
              setRecipe: this.props.setRecipe,
              setReloadRecipes: this.props.setReloadRecipes
            }
          }
        />
      );
    } else if (dashboardSection === 'profile') {
      return (
        <ProfileContainer
          actions={
            {
              setDashboardSection: this.props.setDashboardSection
            }
          }
          loggedUser={this.props.loggedUser} />
      );
    }
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
      return (
        <CreatEditRecipeContainer
          actions={
            {
              setDialogType: this.props.setDialogType,
              setRecipe: this.props.setRecipe,
              setReloadRecipes: this.props.setReloadRecipes
            }
          }
          recipe={this.props.recipe}
          modal={this.props.modal}
        />
      );
    } else if (this.props.modal === 'delete_recipe') {
      return (
        <DeleteRecipeContainer
          actions={
            {
              setDialogType: this.props.setDialogType,
              setReloadRecipes: this.props.setReloadRecipes
            }
          }
          recipe={this.props.recipe}
          modal={this.props.modal}
        />
      );
    } else if (this.props.modal === 'remove_recipe') {
      return (
        <RemoveRecipeContainer
          actions={
            {
              setDialogType: this.props.setDialogType,
              setReloadRecipes: this.props.setReloadRecipes
            }
          }
          recipe={this.props.recipe}
          modal={this.props.modal}
          userId={this.props.loggedUser.id}
        />
      );
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
  recipe: PropTypes.object,
  setReloadRecipes: PropTypes.func,
  reloadRecipes: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    loggedUser: state.user,
    dashboardSection: state.dashboard,
    reloadRecipes: state.reloadRecipes,
    modal: state.dialog,
    recipe: state.recipe,
    userId: state.user.id
  };
};

const actionCreators = {
  logUser,
  setDashboardSection,
  setDialogType,
  setRecipe,
  setReloadRecipes
};

export default connect(mapStateToProps, actionCreators)(Dashboard);