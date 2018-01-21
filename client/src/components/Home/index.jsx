import React, { PureComponent } from 'react';
import WOW from 'wowjs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import toastr from 'toastr';

import Footer from '../commons/Footer';
import AppIntro from './AppIntro';
import SampleRecipes from './SampleRecipes';

import { signIn, signUp } from '../../actions/authActions';

/**
 * @description - Container component for the homepage (Landing page)
 *
 * @class Home
 *
 * @param {string} key - Key name for storing data in state
 *
 * @param {string} value - value to store in state
 *
 * @extends {PureComponent}
 */
class Home extends PureComponent {
  /**
   * @description - Creates an instance of Home.
   *
   * @param {any} props - Component's props
   *
   * @memberof Home
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      authName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false
    };
  }

  /**
   * @description - When component is mounted,
   * load wow animation library
   *
   * @memberof Home
   *
   * @returns {void} Nothing
   */
  componentDidMount() {
    new WOW.WOW().init();
    if (localStorage.getItem('token')) {
      this.context.router.history.push('/recipes/?page=1&limit=10');
    }
  }

  storeToState = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSignIn = () => {
    this.setState({
      isLoading: true
    });

    toastr.remove();
    this.props.signIn(this.state)
      .then(() => {
        toastr.success(`Welcome back <br/><em>${this.state.authName}</em>`);
        setTimeout(() => {
          window.location = '/recipes/?page=1&limit=10';
        }, 300);
      },
      (error) => {
        this.setState({
          isLoading: false
        });
        toastr.error(error.response.data.message);
      });
  };

  handleSignUp = () => {
    this.setState({
      isLoading: true
    });

    toastr.remove();
    if (this.state.password === this.state.confirmPassword) {
      this.props.signUp(this.state)
        .then(() => {
          toastr.info(`Welcome <br/><em>${this.state.username}</em>`);
          setTimeout(() => {
            window.location = '/recipes/?page=1&limit=10';
          }, 300);
        },
        (error) => {
          this.setState({
            isLoading: false
          });

          toastr.error(error.response.data.message);
        });
    } else {
      this.setState({
        isLoading: false
      });
      toastr.error('Passwords don\'t match!');
    }
  };

  /**
   * @description - Renders the Home view
   *
   * @returns {view} view - Rendered view
   *
   * @memberof Home
   */
  render() {
    return (
      <div className="body">
        <main>
          <AppIntro
            isLoading={this.state.isLoading}
            storeToState={this.storeToState}
            handleSignIn={this.handleSignIn}
            handleSignUp={this.handleSignUp}
          />
          <SampleRecipes />
        </main>
        <Footer />
      </div>
    );
  }
}

Home.propTypes = {
  signUp: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired
};

Home.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(null, { signIn, signUp })(Home);
