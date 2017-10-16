import React, { Component } from 'react';
import { Card, Loader, Message, Accordion, Icon, Header } from 'semantic-ui-react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import { connect } from 'react-redux';

import RecipeItem from './RecipeItem';

import { setReloadRecipes } from '../actions/reload_recipe';

const TOKEN = read_cookie('more-recipe-token');

class MyFavorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      my_favs: null,
      activeIndex: -1
    }
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }


  fetchRecipes = () => {
    axios({
      method: 'GET',
      url: `/api/v1/users/${this.props.userId}/recipes`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            my_favs: response.data.recipe
          }
        );
        this.props.setReloadRecipes(false);
      })
      .catch(() => {
      });
  }

  componentDidMount() {
    this.fetchRecipes();
  }

  renderRecipes() {
    const recipes = this.state.my_favs;
    if (!recipes) {
      return (
        <Loader active inline='centered' content='Fetching My Favorites...' />
      )
    } else if (recipes.length === 0) {
      return (
        <Message
          style={{ width: '100%', margin: '10px' }}
          color='green'
          size='large'>
          <Message.Header content="Nothing found!" />
          <Message.Content className="error">
            Sorry, you have not marked any Recipes as favorites....
          </Message.Content>
        </Message>
      )
    } else {
      return (
        recipes.map((recipe) => {
          return (
            <RecipeItem
              key={recipe.id}
              recipe={recipe.Recipe}
            />
          );
        })
      )
    }
  }

  render() {
    const { activeIndex } = this.state

    if (this.props.reloadRecipes) {
      this.fetchRecipes();
    }

    return (
      <div>
        <div className="brand-logo">
          <div className="full-title">My Favorite Recipes</div>
          <div className="rounded-line"></div>
        </div>
        <Accordion styled fluid>
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccordionClick}>
            <Icon name='dropdown' />
            <Header as={'span'}>General</Header>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Card.Group>
              {this.renderRecipes()}
            </Card.Group>
          </Accordion.Content>
        </Accordion>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    reloadRecipes: state.reloadRecipes,
    userId: state.user.id
  }
}

const actionCreators = {
  setReloadRecipes
}

export default connect(mapStateToProps, actionCreators)(MyFavorites);