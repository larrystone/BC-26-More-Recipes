import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card } from 'semantic-ui-react';
import Toastr from 'toastr';

import Header from '../header';
import Info from './info';
import Stats from './stats';
import Footer from '../commons/Footer';

import {
  getUser, updateProfile, changePassword
} from '../../actions/authActions';

const NULL_INDEX = -1;

/**
 * Profile page container component
 *
 * @class Profile
 * @param {string} value
 * @param {string} key
 * @param {object} event
 * @param {number} userId
 * @param {object} titleProps
 * @extends {Component}
 */
class Profile extends Component {
  /**
   * Creates an instance of Profile.
   * @param {object} props
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
      newPassword2: '',
      isLoading: false,
      previewImage: '',
      imageUrl: ''
    };
  }

  /**
   * Called before component mounts
   *
   * @memberof Profile
   * @returns {null} Nothing
   */
  componentWillMount() {
    const { userId } = this.props.match.params;
    this.getUserProfile(userId);
  }


  /**
 * Fetches recipes based on page and limit
 * parameters when components page changes
 *
 * @memberof Recipes
 * @param {object} nextProps - The new prop
 * @returns {void} Null
 */
  componentWillReceiveProps(nextProps) {
    const { userId } = nextProps.match.params;

    if (this.props.match.params.userId !== userId) {
      this.getUserProfile(userId);
    }
  }

  getUserProfile = (userId) => {
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
        const {
          data: { message }
        } = error.response;
        Toastr.error(message);

        setTimeout(() => {
          this.context.router.history.push('/');
        }, 1000);
      });
  }

  handleImageChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
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
    } else {
      this.setState({ imageUrl: '' });
    }
  }

  storeToState = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  handleAccordionClick = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? NULL_INDEX : index;

    this.setState({ activeIndex: newIndex });
  }

  updateProfile = () => {
    const userData = new FormData();

    const {
      name, username, imageUrl
    } = this.state;

    userData.append('name', name);
    userData.append('username', username);
    userData.append('image', imageUrl);

    this.storeToState('isLoading', true);

    this.props.updateProfile(this.props.userId, userData)
      .then(() => {
        Toastr.success('User record updated');
        this.storeToState('isLoading', false);
      })
      .catch((error) => {
        this.storeToState('isLoading', false);
        Toastr.error(error.response.data.message);
      });
  }

  changePassword = () => {
    const { oldPassword, newPassword, newPassword2 } = this.state;

    if (newPassword.trim().length > 5 && (newPassword === newPassword2)) {
      this.storeToState('isLoading', true);
      this.props.changePassword({ oldPassword, newPassword })
        .then(() => {
          this.storeToState('isLoading', false);
          Toastr.success('Password change successful');
        })
        .catch(() => {
          Toastr.error('Unable to change password');
          this.storeToState('isLoading', false);
        });
    } else {
      Toastr
        .error(`${newPassword.trim().length < 6 ?
          'Password must be at least 6 characters in length!' :
          "Passwords don't match!"}`);
    }
  }

  /**
   * Calls the view components to render UI
   *
   * @returns {null} Nothing
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
            <Card.Group style={{ justifyContent: 'center' }}>
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

Profile.propTypes = {
  userId: PropTypes.number.isRequired,
  profile: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  getUser: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired
};

Profile.contextTypes = {
  router: PropTypes.object.isRequired
};

const actionCreators = {
  getUser,
  updateProfile,
  changePassword
};

export default connect(mapStateToProps, actionCreators)(Profile);
