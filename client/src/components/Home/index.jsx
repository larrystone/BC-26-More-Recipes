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
 * Container component for the homepage (Landing page)
 *
 * @class Home
 * @param {string} key
 * @param {string} value
 * @extends {PureComponent}
 */
class Home extends PureComponent {
  /**
   * Creates an instance of Home.
   *
   * @param {any} props
   * @memberof Home
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      authName: '',
      email: '',
      password: '',
      password2: '',
      isLoading: false
    };
  }

  /**
   * When component is mounted,
   * load wow animation library
   *
   * @memberof Home
   * @returns {obj} null
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

    this.props.signIn(this.state)
      .then(() => {
        toastr.clear();
        toastr.success(`Welcome back <br/><em>${this.state.authName}</em>`);
        setTimeout(() => {
          window.location = '/recipes/?page=1&limit=10';
        }, 300);
      },
      (error) => {
        this.setState({
          isLoading: false
        });
        toastr.clear();
        toastr.error(error.response.data.message);
      });
  };

  handleSignUp = () => {
    this.setState({
      isLoading: true
    });

    if (this.state.password === this.state.password2) {
      this.props.signUp(this.state)
        .then(() => {
          toastr.clear();
          toastr.info(`Welcome <br/><em>${this.state.username}</em>`);
          setTimeout(() => {
            window.location = '/recipes/?page=1&limit=10';
          }, 300);
        },
        (error) => {
          this.setState({
            isLoading: false
          });

          toastr.clear();
          toastr.error(error.response.data.message);
        });
    } else {
      toastr.error('Passwords don\'t match!');
    }
  };

  /**
   * Renders the Home view
   *
   * @returns {any} view
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
