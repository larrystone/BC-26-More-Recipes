import React from 'react';
import { Card, Label } from 'semantic-ui-react';
import { Chart } from 'react-google-charts';
import PropTypes from 'prop-types';

/**
 * Stateless component for rendering user analytics
 *
 * @param {object} props
 * @returns {view} Stats
 */
const Stats = ({
  username,
  profile: {
    myRecipes, myReviews, myFavs
  }
}) => (
  <Card
    style={{ width: '550px' }}
  >
    <Label attached="top"><h3>Stats Chart</h3></Label>
    <Card.Content>
      {(!myFavs && !myRecipes && !myReviews) ?
        <center><h5>No data to show</h5></center> :
        <Chart
          chartType="PieChart"
          width="100%"
          data={[
            ['Section', 'Count'],
            ['My Recipes', myRecipes],
            ['My Reviews', myReviews],
            ['My Favorites', myFavs]
          ]}
          options={
            {
              title: `@${username} Summary`,
              pieHole: 0.4,
              is3D: true
            }
          }
          legend_toggle
        />
      }

    </Card.Content>
  </Card>
);

Stats.propTypes = {
  profile: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired
};

export default Stats;

