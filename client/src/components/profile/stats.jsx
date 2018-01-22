import React from 'react';
import { Card, Label } from 'semantic-ui-react';
import { Chart } from 'react-google-charts';
import PropTypes from 'prop-types';

/**
 * @description - Stateless component for rendering user analytics
 *
 * @param {object} props - Component's props
 *
 * @returns {view} view - Rendered view
 */
function Stats({
  username,
  profile: {
    myRecipes, myReviews, myFavs
  }
}) {
  return (
    <Card className="card--profile">
      <Label attached="top"><h3>Stats Chart</h3></Label>
      <Card.Content className="card--profile__pad-top">
        {(!myFavs && !myRecipes && !myReviews) ?
          <center>
            <h5>No data to show</h5>
          </center> :
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
                title: `Activity Chat - @${username}`,
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
}

Stats.propTypes = {
  profile: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired
};

export default Stats;

