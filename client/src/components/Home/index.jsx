import React, { PureComponent } from 'react';
import WOW from 'wowjs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppIntro from './AppIntro';

import { validateSignUp } from '../../../../server/middleware/inputValidation';

import { signIn, signUp } from '../../actions/authActions';
import notify from '../../utils/notify';

/**
 * @description - Container component for the homepage (Landing page)
 *
 * @class Home
 *
 * @extends {PureComponent}
 */
export class HomeView extends PureComponent {
  /**
   * @description - Creates an instance of Home.
   *
   * @param {any} props - Component's props
   *
   * @memberof HomeView
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      authName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false
    };

    this.storeToState = this.storeToState.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  /**
   * @description - When component is mounted,
   * load wow animation library
   *
   * @memberof HomeView
   *
   * @returns {void} Nothing
   */
  componentDidMount() {
    new WOW.WOW().init();
    if (localStorage.getItem('token')) {
      this.context.router.history.push('/recipes/?page=1&limit=10');
    }
  }
  /**
   * @description Stores data into component's state
   *
   * @param {string} key - Key name for storing data in state
   *
   * @param {string} value - value to store in state
   *
   * @returns {void} Nothing
   */
  storeToState(key, value) {
    this.setState({ [key]: value });
  }

  /**
   * @description Handles user sign in
   *
   * @memberof HomeView
   *
   * @returns {void} Nothing
   */
  handleSignIn() {
    this.setState({
      isLoading: true
    });

    this.props.signIn(this.state)
      .then(() => {
        notify('success', `Welcome back <br/><em>${this.state.authName}</em>`);
        setTimeout(() => {
          window.location = '/recipes/?page=1&limit=10';
        }, 300);
      },
      (error) => {
        this.setState({
          isLoading: false
        });
        notify('error', error.response.data.message);
      });
  }

  /**
   * @description Handles user sign up
   *
   * @memberof HomeView
   *
   * @returns {void} Nothing
   */
  handleSignUp() {
    this.setState({
      isLoading: true
    });

    const validation = validateSignUp(this.state);
    if (validation.length > 0) {
      this.setState({
        isLoading: false
      });
      notify('error', validation);
    } else if (this.state.password === this.state.confirmPassword) {
      this.props.signUp(this.state)
        .then(() => {
          notify('info', `Welcome <br/><em>${this.state.username}</em>`);
          setTimeout(() => {
            window.location = '/recipes/?page=1&limit=10';
          }, 300);
        },
        (error) => {
          this.setState({
            isLoading: false
          });
          notify('error', error.response.data.message.replace(';;', '\n'));
        });
    } else {
      this.setState({
        isLoading: false
      });
      notify('error', 'Passwords don\'t match!');
    }
  }

  /**
   * @description - Renders the Home view
   *
   * @returns {view} view - Rendered view
   *
   * @memberof HomeView
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
        </main>
      </div>
    );
  }
}

HomeView.propTypes = {
  signUp: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired
};

HomeView.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(null, { signIn, signUp })(HomeView);
