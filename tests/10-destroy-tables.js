import models from './../server/models';

const user = models.User;
const recipe = models.Recipe;
const favorite = models.Favorite;
const upvote = models.Upvote;
const downvote = models.Downvote;
const review = models.Review;

describe('Destroy tables after tests', () => {
  user.destroy({
    where: { },
    truncate: true,
    cascade: true
  });

  recipe.destroy({
    where: { },
    truncate: true,
    cascade: true
  });

  favorite.destroy({
    where: { },
    truncate: true,
    cascade: true
  });

  upvote.destroy({
    where: { },
    truncate: true,
    cascade: true
  });

  downvote.destroy({
    where: { },
    truncate: true,
    cascade: true
  });

  review.destroy({
    where: { },
    truncate: true,
    cascade: true
  });
});

