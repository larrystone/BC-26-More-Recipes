import React, { Component } from 'react';
import { connect } from 'react-redux';

import DashboardHeader from './DashboardHeader';
import Footer from './Footer';
import RecipeHome from './RecipeHome';

class Dashboard extends Component {
  showDashboardSection = () => {
    const { dashboardSection } = this.props;
    if (dashboardSection === 'home') {
      return (
        <RecipeHome/>
      )
    } else if (dashboardSection === 'my_recipes') {
      return (
        <div>Welcome to My recipes</div>
      )
    } else if (dashboardSection === 'my_favs') {
      return (
        <div>Welcome to My favs</div>
      )
    } else {
      return <div></div>
    }
  }

  render() {
    return (
      <div className='body'>
        <DashboardHeader />
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
    dashboardSection: state.dashboard
  }
}

export default connect(mapStateToProps, null)(Dashboard);