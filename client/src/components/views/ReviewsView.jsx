import React from 'react';
import {
  Divider, Button, Card,
  Comment, Header, Form, Popup
} from 'semantic-ui-react';
import moment from 'moment';
import PropTypes from 'prop-types';

import generateInitials from '../../helpers/initial';
import { dateOptions } from '../../constants';

const MAX_COUNT = 5,
  EMPTY = 0;

const ReviewsView = ({ reviewActions, reviews, newReview,
  currentIndex, posting, error }) => {
  const showReviews = () => {
    const visibleReviews = reviews.slice(currentIndex,
      currentIndex + MAX_COUNT);
    return (
      visibleReviews.map((review, index) => {
        const { content, User, updatedAt } = review;
        return (
          <Comment key={index}>
            <Button
              floated='left'
              compact
              style={{ padding: '13px' }}
            >
              {generateInitials(User.name)}
            </Button>
            <Comment.Content>
              <Comment.Author as='span'>{User.name}</Comment.Author>
              <Comment.Metadata>
                <Popup
                  inverted
                  size='mini'
                  trigger={
                    <span>
                      - {moment(new Date(updatedAt)).fromNow()}
                    </span>}
                  content={
                    <div>
                      {new Date(updatedAt)
                        .toLocaleDateString('en-US', dateOptions)}
                    </div>
                  }
                />
              </Comment.Metadata>
              <Comment.Text >{content}</Comment.Text>
            </Comment.Content>
          </Comment>
        );
      })
    );
  };

  const renderReviews = () => {
    if (!reviews) {
      return (
        <Comment>
          <Comment.Content>
            <Comment.Text>
              Loading Reviews...
            </Comment.Text>
          </Comment.Content>
        </Comment>
      );
    } else if (reviews.length === EMPTY) {
      return (
        <Comment>
          <Comment.Content>
            <Comment.Text>No user posted a review</Comment.Text>
          </Comment.Content>
        </Comment>
      );
    }
    return (
      <div>
        {showReviews()}
      </div>
    );
  };

  const showLoadNewer = () => {
    if (currentIndex > EMPTY) {
      return (
        <center>
          <a onClick={() => {
            reviewActions.storeToState(
              'currentIndex', currentIndex - MAX_COUNT
            );
          }}>
            &lt;&lt; Load Newer
          </a>
        </center>
      );
    }
  };

  const showLoadOlder = () => {
    if (reviews) {
      if (currentIndex < reviews.length - MAX_COUNT) {
        return (
          <center><a onClick={() => {
            reviewActions.storeToState(
              'currentIndex', currentIndex + MAX_COUNT
            );
          }}>
            Load Older >>
          </a></center>
        );
      }
    }
  };

  return (
    <Card centered style={{ padding: '20px', width: '450px' }}>
      <Comment.Group>
        <Header as='h3'>Reviews</Header>
        <Form reply>
          <Form.TextArea
            style={{ maxHeight: '100px' }}
            placeholder='Write a review'
            value={newReview}
            disabled={posting}
            onChange={(event) => {
              reviewActions.storeToState('content', event.target.value);
              reviewActions.storeToState('error', '');
            }}
          />
          <p className='error'>
            {error}
          </p>
          <Button
            disabled={posting}
            content='Post review' labelPosition='left' icon='edit' primary
            onClick={() => reviewActions.postReview()}
          />
        </Form>
        {showLoadNewer()}
        <Divider />
        {renderReviews()}
        <Divider />
        {showLoadOlder()}
      </Comment.Group>
    </Card>
  );
};

ReviewsView.propTypes = {
  reviewActions: PropTypes.object,
  reviews: PropTypes.array,
  currentIndex: PropTypes.number,
  error: PropTypes.string,
  newReview: PropTypes.string,
  posting: PropTypes.bool
};

export default ReviewsView;