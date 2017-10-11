import React, { Component } from 'react';
import { read_cookie } from 'sfcookies';
import axios from 'axios';
import { Divider, Button, Card, Comment, Label, Header, Form } from 'semantic-ui-react';
import moment from 'moment';
import { connect } from 'react-redux';

import generateInitials from '../helpers/initial';

const TOKEN = 'more-recipe-token';

class RecipeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: null,
      content: ''
    }
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
      reviews.map((review, index) => {
        const { content, User, updatedAt } = review;
        return (
          <Comment key={index}>
            <Divider />
            <Comment.Content>
              <Label horizontal circular>{generateInitials(User.name)}</Label>
              <Comment.Author as='span'>{User.name}</Comment.Author>
              <Comment.Metadata>
                - {moment(new Date(updatedAt)).fromNow()}
              </Comment.Metadata>
              <Comment.Text style={{ marginLeft: '32px' }}>{content}</Comment.Text>
            </Comment.Content>
          </Comment>
        )
      })
    )
  }

  fetchReviews() {
    axios({
      method: 'GET',
      url: `/api/v1/recipes/${this.props.recipeId}/reviews`,
      headers: { 'x-access-token': read_cookie(TOKEN) }
    })
      .then((response) => {
        this.setState(
          {
            reviews: response.data.recipe
          }
        )
      })
      .catch(() => {
      });
  }

  componentDidMount() {
    this.fetchReviews();
  }

  render() {
    return (
      <Card centered style={{ padding: '20px', width: "450px" }}>
        <Comment.Group>
          <Header as='h3'>Reviews</Header>
          <Form reply>
            <Form.TextArea
              onChange={(event) => {
                this.setState(
                  { content: event.target.value }
                )
              }}
              value={this.state.content}
            />
            <Button content='Post review' labelPosition='left' icon='edit' primary
              onClick={() => this.postReview()}
            />
          </Form>
          {this.renderReviews()}
        </Comment.Group>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    recipeId: state.recipe
  }
}

export default connect(mapStateToProps, null)(RecipeDetails);