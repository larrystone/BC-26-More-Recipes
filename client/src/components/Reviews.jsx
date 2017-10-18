import React, { Component } from 'react';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import { Divider, Button, Card, Comment, Header, Form } from 'semantic-ui-react';
import moment from 'moment';
import { connect } from 'react-redux';

import generateInitials from '../helpers/initial';

const TOKEN = read_cookie('more-recipe-token');

class RecipeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: null,
      content: '',
      error: '',
      posting: false,
      currentIndex: 0
    }
  }

  showReviews = () => {
    const { reviews, currentIndex } = this.state;
    const visibleReviews = reviews.slice(currentIndex, currentIndex + 5);
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
                - {moment(new Date(updatedAt)).fromNow()}
              </Comment.Metadata>
              <Comment.Text >{content}</Comment.Text>
            </Comment.Content>
          </Comment>
        )
      })
    )
  }

  renderReviews() {
    const { reviews } = this.state;
    if (!reviews) {
      return (
        <Comment>
          <Comment.Content>
            <Comment.Text>
              Loading Reviews...
            </Comment.Text>
          </Comment.Content>
        </Comment>
      )
    } else if (reviews.length === 0) {
      return (
        <Comment>
          <Comment.Content>
            <Comment.Text>No user posted a review</Comment.Text>
          </Comment.Content>
        </Comment>
      )
    }
    return (
      <div>
        {this.showReviews()}
      </div>
    )
  }

  fetchReviews() {
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
        )
      })
      .catch(() => {
      });
  }

  componentDidMount() {
    this.fetchReviews();
  }

  showLoadNewer = () => {
    const { currentIndex } = this.state;
    if (currentIndex > 0) {
      return (
        <center><a onClick={() => {
          this.setState(
            { currentIndex: currentIndex - 5 }
          )
        }}>
          &lt;&lt; Load Newer
        </a></center>
      )
    } else {
      return <div></div>
    }
  }

  showLoadOlder = () => {
    const { currentIndex, reviews } = this.state;

    if (reviews) {
      if (currentIndex < reviews.length - 5) {
        return (
          <center><a onClick={() => {
            this.setState(
              { currentIndex: currentIndex + 5 }
            )
          }}>
            Load Older >>
          </a></center>
        )
      } else {
        return <div></div>
      }
    }
  }

  render() {
    const { posting } = this.state;
    return (
      <Card centered style={{ padding: '20px', width: "450px" }}>
        <Comment.Group>
          <Header as='h3'>Reviews</Header>
          <Form reply>
            <Form.TextArea
              style={{ maxHeight: '100px' }}
              placeholder='Write a review'
              disabled={posting}
              onChange={(event) => {
                this.setState(
                  {
                    content: event.target.value,
                    error: ''
                  }
                )
              }}
              value={this.state.content}
            />
            <p className='error'>
              {this.state.error}
            </p>
            <Button
              disabled={posting}
              content='Post review' labelPosition='left' icon='edit' primary
              onClick={() => this.postReview()}
            />
          </Form>
          {this.showLoadNewer()}
          <Divider />
          {this.renderReviews()}
          <Divider />
          {this.showLoadOlder()}
        </Comment.Group>
      </Card>
    )
  }

  postReview = () => {
    const { content } = this.state;
    this.setState(
      { posting: true }
    )
    axios({
      method: 'POST',
      url: `/api/v1/recipes/${this.props.recipe.id}/reviews`,
      headers: { 'x-access-token': TOKEN },
      data: { content }
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState(
            {
              content: '',
              posting: false
            }
          )
          this.fetchReviews();
        }
      })
      .catch((error) => {
        this.setState(
          {
            error: error.response.data.message,
            posting: false
          }
        )
      });
  }
}

const mapStateToProps = (state) => {
  return {
    recipe: state.recipe
  }
}

export default connect(mapStateToProps, null)(RecipeDetails);