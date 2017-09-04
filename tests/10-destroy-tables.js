import models from './../server/models';

const user = models.User;

describe('Destroy tables after tests', () => {
  user.destroy({
    where: { },
    truncate: true,
    cascade: true
  });
});

