import React, { PureComponent } from 'react';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ReviewsView from '../views/ReviewsView';

const TOKEN = read_cookie('more-recipe-token');
const STATUS_OK = 201;

class Reviews extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reviews: null,
      content: '',
      error: '',
      posting: false,
      currentIndex: 0
    };
  }

  storeToState = (key, value) => {
    this.setState(
      {
        [key]: value
      }
    );
  };

  fetchReviews = () => {
    axios({
      method: 'GET',
      url: `/api/v1/recipes/${this.props.recipe.id}/reviews`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const reviews = response.data.recipe.reverse();
        this.setState(
          {
            reviews,
            currentIndex: 0
          }
        );
      })
      .catch(() => {
      });
  }

  postReview = () => {
    const { content } = this.state;
    this.setState(
      { posting: true }
    );
    axios({
      method: 'POST',
      url: `/api/v1/recipes/${this.props.recipe.id}/reviews`,
      headers: { 'x-access-token': TOKEN },
      data: { content }
    })
      .then((response) => {
        if (response.status === STATUS_OK) {
          this.setState(
            {
              content: '',
              posting: false
            }
          );
          this.fetchReviews();
        }
      })
      .catch((error) => {
        this.setState(
          {
            error: error.response.data.message,
            posting: false
          }
        );
      });
  }

  componentDidMount() {
    this.fetchReviews();
  }

  render() {
    return (
      <ReviewsView
        reviewActions={
          {
            storeToState: this.storeToState,
            postReview: this.postReview
          }
        }
        newReview={this.state.content}
        reviews={this.state.reviews}
        currentIndex={this.state.currentIndex}
        posting={this.state.posting}
        error={this.state.error}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recipe: state.recipe
  };
};

Reviews.propTypes = {
  recipe: PropTypes.object
};

export default connect(mapStateToProps, null)(Reviews);