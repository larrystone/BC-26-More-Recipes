import React, { Component } from 'react';
import { Card, Loader, Icon, Label, Input, Message, Select, Button } from 'semantic-ui-react';
import axios from 'axios';
import { read_cookie } from 'sfcookies';
import { connect } from 'react-redux';

import RecipeItem from './RecipeItem';
import RecipeDetails from './RecipeDetails';

const TOKEN = read_cookie('more-recipe-token');

const options = [
  { key: 'recipes', text: 'by Name', value: 'recipes' },
  { key: 'ingredients', text: 'by Ingredient', value: 'ingredients' }
]

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: null,
      searchCategory: 'recipes',
      searchTerm: '',
      searching: false,
      sought: false
    }
  }

  fetchTopRecipes = () => {
    axios({
      method: 'GET',
      url: '/api/v1/recipes?sort=upvotes&order=descending',
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            recipes: response.data.recipe
          }
        )
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.fetchTopRecipes();
  }

  renderRecipes() {
    const recipes = this.state.recipes;
    if (!recipes) {
      return (
        <Loader active
          style={{ marginTop: "40px" }}
          inline='centered'
          content='Fetching Great Recipes ' />
      )
    } else if (recipes.length === 0) {
      return (
        <Message
          style={{ width: '100%', margin: '10px' }}
          color='green'
          size='large'>
          <Message.Header content="Nothing found!" />
          <Message.Content className="error">
            Sorry, no recipes found!!!
          </Message.Content>
        </Message>
      )
    } else {
      return (
        recipes.map((recipe) => {
          return (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
            />
          );
        })
      )
    }
  }

  handleSearch = () => {
    this.setState(
      { searching: true }
    )
    const { searchTerm, searchCategory } = this.state;
    axios({
      method: 'GET',
      url: `/api/v1/recipes?${searchCategory}=${searchTerm.replace(/\s+/g, '+')}`,
      headers: { 'x-access-token': TOKEN }
    })
      .then((response) => {
        this.setState(
          {
            recipes: response.data.recipe,
            searching: false,
            sought: true
          }
        )
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showHeading = () => {
    if (this.state.sought) {
      return (
        <div className="brand-logo">
          <div className="full-title">Search Results &nbsp;&nbsp;
            <Label as='a' color='teal'
              className="clickable"
              onClick={() => {
                this.setState(
                  { sought: false }
                );
                this.fetchTopRecipes();
              }}
            >{this.state.recipes.length} Results
            <Icon name='close' />
            </Label>
          </div>
          <div className="rounded-line"></div>
        </div>
      )
    } else {
      return (
        <div className="brand-logo">
          <div className="full-title">Top Picks</div>
          <div className="rounded-line"></div>
        </div>
      )
    }
  }

  renderModals = () => {
    if (this.props.modal === 'recipe_details') {
      return <RecipeDetails />
    } else {
      return <div></div>
    }
  }

  render() {
    const { searching } = this.state;
    return (
      <div>
        <div className="flex-row">
          {this.showHeading()}
          {this.renderModals()}
          <div>
            <Input type='text' placeholder='Search for recipe...' action
              disabled={searching}
              onChange={(event) => {
                this.setState(
                  { searchTerm: event.target.value }
                )
              }}>
              <input />
              <Select compact options={options} defaultValue='recipes'
                disabled={searching}
                onChange={(event, data) => {
                  this.setState(
                    { searchCategory: data.value }
                  )
                }}
              />
              <Button animated positive
                disabled={searching}
                onClick={() => { this.handleSearch() }}>
                <Button.Content hidden>Go</Button.Content>
                <Button.Content visible>
                  <Icon name='search' />
                </Button.Content>
              </Button>
            </Input>
          </div>
        </div>
        <Card.Group>
          {this.renderRecipes()}
        </Card.Group>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.dialog
  }
}

export default connect(mapStateToProps, null)(Main);