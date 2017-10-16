import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Card, Label, Button, Segment, Accordion, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';

const TOKEN = read_cookie('more-recipe-token');

import * as validate from '../../../server/middleware/validate';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      email: '',
      password1: '',
      password2: '',
      error: '',
      loading: false,
      activeIndex: -1
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    axios({
      method: 'GET',
      url: `/api/v1/users/${this.props.loggedUserId}/profile`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        const { username, email, name } = response.data.user;
        this.setState(
          {
            username,
            email,
            name,
            loading: false
          }
        )
      })
      .catch((err) => {
        this.setState(
          { loading: false }
        )
      });
  }

  storeToState(key, value) {
    this.setState(
      {
        [key]: value,
        error: ''
      }
    )
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  renderProfileDetails = () => {
    const { loading, activeIndex, username, email, name } = this.state;
    return (
      <Card style={{ width: '550px', margin: '10px' }}>
        <Label attached='top'><h3>Basic Information</h3></Label>
        <Card.Content>
          <Form>
            <Form.Input
              disabled={loading}
              label='Full Name'
              placeholder='Enter your full name'
              value={name}
              onChange={(event) => {
                this.storeToState('name', event.target.value)
              }} />
            <Form.Input
              disabled={loading}
              label='Username'
              placeholder='Username'
              value={username}
              onChange={(event) => {
                this.storeToState('username', event.target.value)
              }} />
            <Form.Input
              disabled
              label='Email Address'
              placeholder='Email Address'
              value={email}
            />

            <Form.Button positive
              disabled={loading}
            >
              Update
          </Form.Button>
          </Form>

          <Accordion>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccordionClick}>
              <Icon name='dropdown' />
              Change Password
          </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <Form>
                <Form.Input
                  disabled={loading}
                  label='Enter Old Password'
                  placeholder='Password'
                  type='password'
                  onChange={(event) => {
                    this.storeToState('password1', event.target.value)
                  }} />
                <Form.Input
                  disabled={loading}
                  label='Enter new Password'
                  placeholder='Password'
                  type='password'
                  onChange={(event) => {
                    this.storeToState('password1', event.target.value)
                  }} />
                <Form.Input
                  disabled={loading}
                  label='Re-enter new Password'
                  placeholder='Re-enter Password'
                  type='password'
                  onChange={(event) => {
                    this.storeToState('password2', event.target.value)
                  }} />
                <div className='error'>
                  {this.state.error}
                </div>

                <Form.Button
                  disabled={loading}
                  color='red'
                  onClick={(event) => {
                    this.updatePassword(event);
                  }}>
                  Change Password
              </Form.Button>
              </Form>
            </Accordion.Content>
          </Accordion>
        </Card.Content>
      </Card>
    )
  }

  render() {
    return (
      <Card.Group>
        {this.renderProfileDetails()}
      </Card.Group>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedUserId: state.user.id
  }
}

export default connect(mapStateToProps, null)(Profile);