import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';

import Header from '../header';
import Info from './Info';
import Stats from './Stats';
import Footer from '../commons/Footer';

import {
  getUser, updateProfile, changePassword
} from '../../actions/authActions';
import notify from '../../utils/notify';

const NULL_INDEX = -1;

/**
 * @description - Profile page container component
 *
 * @class Profile
 *
 * @extends {Component}
 */
export class ProfileContainer extends Component {
  /**
   * @description - Creates an instance of Profile
   *
   * @param {object} props - Component's props
   *
   * @memberof Profile
   */
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      username: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      isLoading: false,
      previewImage: '',
      imageUrl: ''
    };
    this.getUserProfile = this.getUserProfile.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.storeToState = this.storeToState.bind(this);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  /**
   * @description - Get user profile details
   *
   * @memberof Profile
   *
   * @returns {void} Nothing
   */
  componentWillMount() {
    const { userId } = this.props.match.params;
    this.getUserProfile(userId);
  }


  /**
   * @description - Fetches recipes based on page and limit
   * parameters when components page changes
   *
   * @memberof Recipes
   *
   * @param {object} nextProps - The new props
   *
   * @returns {void} Nothing
   */
  componentWillReceiveProps(nextProps) {
    const { userId } = nextProps.match.params;

    if (this.props.match.params.userId !== userId) {
      this.getUserProfile(userId);
    }
  }

  /**
   * @description - Fetch user profile
   *
   * @memberof Profile
   *
   * @param {number} userId - User ID
   *
   * @returns {void} Nothing
   */
  getUserProfile(userId) {
    this.setState({
      isLoading: true
    });

    this.props.getUser(userId)
      .then(() => {
        const {
          name, username, email, imageUrl
        } = this.props.profile;
        this.setState({
          isLoading: false,
          name,
          username,
          email,
          previewImage: imageUrl
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        });
        notify('error', error.response.data.message);

        setTimeout(() => {
          this.context.router.history.push('/');
        }, 1000);
      });
  }

  /**
   * @description - Handle image change
   * For displaying image thumbnail
   *
   * @memberof Profile
   *
   * @param {object} event - Form item event object
   *
   * @returns {void} Nothing
   */
  handleImageChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.files[0]
    });
    const reader = new FileReader();
    reader.onload = (nextEvent) => {
      this.setState({
        previewImage: nextEvent.target.result
      });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  /**
   * @description - Stores data into the component state object
   *
   * @memberof Profile
   *
   * @param {string} key - Name for storing item in component's state
   *
   * @param {string} value - Value to store in component's state
   *
   * @returns {void} Nothing
   */
  storeToState(key, value) {
    this.setState({
      [key]: value
    });
  }

  /**
   * @description - Handles togling the accordion component
   *
   * @memberof Profile
   *
   * @param {object} event - Form item event object
   *
   * @param {object} titleProps - Accordion Title Properties
   *
   * @returns {void} Nothing
   */
  handleAccordionClick(event, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? NULL_INDEX : index;

    this.setState({ activeIndex: newIndex });
  }

  /**
   * @description - Parse data and calls the updateProfile action creator
   *
   * @memberof Profile
   *
   * @returns {void} Nothing
   */
  updateProfile() {
    const userData = new FormData();

    const {
      name, username, imageUrl
    } = this.state;

    userData.append('name', name);
    userData.append('username', username);
    userData.append('image', imageUrl);

    this.storeToState('isLoading', true);

    this.props.updateProfile(userData)
      .then(() => {
        notify('success', 'User record updated');
        this.storeToState('isLoading', false);
      })
      .catch((error) => {
        this.storeToState('isLoading', false);
        notify('error', error.response.data.message);
      });
  }

  /**
   * @description Change user password
   *
   * @memberof Profile
   *
   * @returns {void} Nothing
   */
  changePassword() {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    if (newPassword.trim().length > 5 && (newPassword === confirmPassword)) {
      this.storeToState('isLoading', true);
      this.props.changePassword({ oldPassword, newPassword })
        .then(() => {
          this.storeToState('isLoading', false);
          notify('success', 'Password change successful');
        })
        .catch(() => {
          notify('error', 'Unable to change password');
          this.storeToState('isLoading', false);
        });
    } else {
      notify('error', `${newPassword.trim().length < 6 ?
        'Password must be at least 6 characters in length!' :
        "Passwords don't match!"}`);
    }
  }

  /**
   * @description - Calls the view components to render UI
   *
   * @returns {view} view - Rendered view
   *
   * @memberof Profile
   */
  render() {
    const {
      name, username, email, previewImage
    } = this.state;
    return (
      <div className="body">
        <Header />
        <main>
          <div className="push-down">
            <Card.Group className="flex">
              <Info
                actions={{
                  storeToState: this.storeToState,
                  handleAccordionClick: this.handleAccordionClick,
                  handleImageChange: this.handleImageChange,
                  updateProfile: this.updateProfile,
                  changePassword: this.changePassword
                }}
                isAdmin={this.props.userId === this.props.profile.userId}
                loading={this.state.isLoading}
                activeIndex={this.state.activeIndex}
                profile={{
                  name, username, email, previewImage
                }}
                error={this.state.error}
              />
              <Stats
                username={this.state.username}
                profile={this.props.profile}
              />
            </Card.Group>
          </div>
        </main>
        <Footer />
      </div >
    );
  }
}

/**
 * @description - Maps data from Redux state to props
 *
 * @param {object} state - Redux state
 *
 * @returns {object} Props - Component's props
 */
const mapStateToProps = (state) => {
  const {
    auth: {
      user, profile
    }
  } = state;
  return {
    userId: user.id,
    profile
  };
};

ProfileContainer.propTypes = {
  userId: PropTypes.number.isRequired,
  profile: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  getUser: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired
};

ProfileContainer.contextTypes = {
  router: PropTypes.object.isRequired
};

const actionCreators = {
  getUser,
  updateProfile,
  changePassword
};

export default connect(mapStateToProps, actionCreators)(ProfileContainer);
