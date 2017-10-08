import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import HomeHeader from './HomeHeader';
import Footer from './Footer';
import RecipeItem from './RecipeItem';
import SignUpSignIn from './SignUpSignIn';

import SampleRecipes from '../SampleRecipes.json';

class Home extends Component {
  renderSampleRecipes = () => {
    const samples = SampleRecipes;
    return (
      samples.map(sample => (
        <RecipeItem
          key={sample.id}
          recipe={sample}
        />
      ))
    );
  }

  renderIntro = () => {
    return (
      <div>
        <div>
          <img src="images/egusi.jpg" width="100%" alt="Sample food 1" />
          {/*<h2 className="overlay">It's all about the food... and sometimes the drinks</h2>*/}
        </div>

        <div className="intro">
          <h3 className="full-title">More-Recipes</h3>
          <p> More-Recipes is your social media for connecting with wonderful delicacies! </p>
          <ul>
            <li> ~ Share your recipe ideas and inventions with the world</li>
            <li> ~ Try something new from others' recipe ideas </li>
            <li> ~ Share your feedback about the new experience (Upvote, downvote or express how you feel in your own words!)</li>
            <li> ~ Like a recipe? go on and add it to your favorite recipes list !</li>
          </ul>
        </div>

        <div>
          <img src="images/efo.jpg" width="100%" alt="Sample food 2" />
          {/*<h2 className="overlay">So, anyone hungry yet?</h2>*/}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='body'>
        <HomeHeader />
        <main>
          <SignUpSignIn />
          {this.renderIntro()}
          <div className="full-title">Featured Recipes</div>
          <div className="rounded-line" />

          <Card.Group>
            {this.renderSampleRecipes()}
          </Card.Group>
        </main>
        <Footer />
      </div>
    );
  }
}

export default Home;