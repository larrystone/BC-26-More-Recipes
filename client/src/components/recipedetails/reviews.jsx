import React from 'react';
import {
  Divider, Button, Card,
  Comment, Header, Form, Popup
} from 'semantic-ui-react';
import moment from 'moment';
import PropTypes, { object } from 'prop-types';

import avatar from '../../../images/avatar.png';
import { dateOptions } from '../../constants';

const MAX_COUNT = 10,
  EMPTY = 0;

/**
 * Stateless component for rendering pagination view
 *
 * @param {object} props
 * @returns {view} RecipeItem
 */
const ReviewsView = ({
  actions, reviews, newReview,
  index, posting
}) => {
  /**
   * Returns the reviews
   *
   * @returns {view} reviews
   */
  const getReviews = () => {
    const visibleReviews = reviews
      .slice(index, index + MAX_COUNT);
    return (
      visibleReviews.map((review) => {
        const {
          content, User, createdAt, id
        } = review;
        return (
          <Comment key={id} style={{ marginBottom: '10px' }}>
            <Comment.Avatar
              src={User.imageUrl || avatar}
              style={{ height: '36px', width: '36px' }}
            />
            <Comment.Content>
              <Comment.Author as="span">{User.name}</Comment.Author>
              <Comment.Metadata>
                <Popup
                  inverted
                  size="mini"
                  trigger={
                    <span>
                      - {moment(new Date(createdAt)).fromNow()}
                    </span>}
                  content={
                    <div>
                      {new Date(createdAt)
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

  /**
   * Render the reviews on a recipe
   *
   * @returns {view} view
   */
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
        {getReviews()}
      </div>
    );
  };

  /**
   * Render the next button if available
   *
   * @returns {view} Button
   */
  const showLoadNewer = () => {
    if (index > EMPTY) {
      return (
        <center>
          <button
            style={{ border: 'none', color: 'blue' }}
            className="clickable"
            onClick={() => {
              actions.storeToState('index', index - MAX_COUNT);
            }}
          >
            {'Load newer'}
          </button>
        </center>
      );
    }
  };

  /**
   * Render the previous button if available
   *
   * @returns {view} Button
   */
  const showLoadOlder = () => {
    if (reviews) {
      if (index < reviews.length - MAX_COUNT) {
        return (
          <center>
            <button
              style={{ border: 'none', color: 'blue' }}
              className="clickable"
              onClick={() => {
                actions.storeToState('index', index + MAX_COUNT);
              }}
            >
              {'Load older'}
            </button>
          </center>
        );
      }
    }
  };

  return (
    <Card color="blue" style={{ padding: '20px', width: '450px' }}>
      <Comment.Group>
        <Header as="h3">Reviews</Header>
        <Form reply>
          <Form.TextArea
            style={{ maxHeight: '100px' }}
            placeholder="Write a review"
            value={newReview}
            disabled={posting}
            onChange={(event) => {
              actions.storeToState('content', event.target.value);
              actions.storeToState('error', '');
            }}
          />
          <Button
            disabled={posting}
            content="Post review"
            labelPosition="left"
            icon="edit"
            primary
            onClick={() => actions.addReview()}
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
  actions: PropTypes.shape().isRequired,
  reviews: PropTypes.arrayOf(object).isRequired,
  index: PropTypes.number.isRequired,
  newReview: PropTypes.string.isRequired,
  posting: PropTypes.bool.isRequired
};

export default ReviewsView;
