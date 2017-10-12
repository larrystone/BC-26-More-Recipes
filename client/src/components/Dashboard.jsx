import React, { Component } from 'react';
import { connect } from 'react-redux';

import DashboardHeader from './DashboardHeader';
import Footer from './Footer';
import RecipeHome from './RecipeHome';
import MyRecipes from './MyRecipes';
import RecipeDetails from './RecipeDetails';

class Dashboard extends Component {
  showDashboardSection = () => {
    const { dashboardSection } = this.props;
    if (dashboardSection === 'home') {
      return (
        <RecipeHome />
      )
    } else if (dashboardSection === 'my_recipes') {
      return (
        <MyRecipes />
      )
    } else if (dashboardSection === 'my_favs') {
      return (
        <div>Welcome to My favs</div>
      )
    } else {
      return <div></div>
    }
  }

  renderModals = () => {
    if (this.props.modal === 'recipe_details') {
      return <RecipeDetails />
    } else {
      return <div></div>
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
  }
}

export default connect(mapStateToProps, null)(Dashboard);