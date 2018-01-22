import models from './../models';

const {
  User, Recipe, Favorite, Upvote, Downvote, Review
} = models;

describe('Destroy tables after tests', () => {
  it('should return \'Enter a valid full name!\' for a null name', (done) => {
    User.destroy({
      where: {},
      truncate: true,
      cascade: true
    });

    Recipe.destroy({
      where: {},
      truncate: true,
      cascade: true
    });

    Favorite.destroy({
      where: {},
      truncate: true,
      cascade: true
    });

    Upvote.destroy({
      where: {},
      truncate: true,
      cascade: true
    });

    Downvote.destroy({
      where: {},
      truncate: true,
      cascade: true
    });

    Review.destroy({
      where: {},
      truncate: true,
      cascade: true
    });
    done();
  });
});

