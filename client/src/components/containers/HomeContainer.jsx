import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';

import HomeView from '../views/HomeView';
import Recipes from '../../SampleRecipes.json';

import { setDialogType } from '../../actions/dialog';
import { setRecipe } from '../../actions/recipe';

class HomeContainer extends PureComponent {
  componentWillMount() {
    const { username } = this.props.loggedUser;
    if (username) {
      createBrowserHistory().replace('/dashboard');
      window.location.reload();
    }
  }

  render() {
    return (
      <HomeView
        actions={
          {
            setDialogType: this.props.setDialogType,
            setRecipe: this.props.setRecipe
          }
        }
        dialogType={this.props.dialogType}
        dashboardSection={this.props.dashboardSection}
        recipes={Recipes}
        loggedUser={this.props.loggedUser}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedUser: state.user,
    dialogType: state.dialog,
    dashboardSection: state.dashboard
  };
};

HomeContainer.propTypes = {
  loggedUser: PropTypes.object,
  setRecipe: PropTypes.func,
  setDialogType: PropTypes.func,
  dialogType: PropTypes.string,
  dashboardSection: PropTypes.string
};

const actionCreators = {
  setDialogType, setRecipe
};

export default connect(mapStateToProps, actionCreators)(HomeContainer);