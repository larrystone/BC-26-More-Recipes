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
 * @description - Stateless component for rendering pagination view
 *
 * @param {object} props - Component's props
 *
 * @returns {view} RecipeItem - Rendered view
 */
function ReviewsView({
  actions, reviews, newReview,
  index, posting
}) {
  /**
   * @description - Returns the reviews
   *
   * @returns {view} reviews - Rendered reviews
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
          <Comment key={id} className="comment">
            <Comment.Avatar
              src={User.imageUrl || avatar}
              className="comment__avatar"
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
   * @description - Render the reviews on a recipe
   *
   * @returns {view} view - Rendered view
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
   * @description - Render the next button if available
   *
   * @returns {view} Button - Rendered view
   */
  const showLoadNewer = () => {
    if (index > EMPTY) {
      return (
        <center>
          <button
            className="clickable button--no-border__blue"
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
   * @description - Render the previous button if available
   *
   * @returns {view} Button - Rendered view
   */
  const showLoadOlder = () => {
    if (reviews) {
      if (index < reviews.length - MAX_COUNT) {
        return (
          <center>
            <button
              className="clickable button--no-border__blue"
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
    <Card color="blue" className="card--review">
      <Comment.Group>
        <Header as="h3">Reviews</Header>
        <Form reply>
          <Form.TextArea
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
            color="brown"
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
}

ReviewsView.propTypes = {
  actions: PropTypes.shape().isRequired,
  reviews: PropTypes.arrayOf(object).isRequired,
  index: PropTypes.number.isRequired,
  newReview: PropTypes.string.isRequired,
  posting: PropTypes.bool.isRequired
};

export default ReviewsView;
