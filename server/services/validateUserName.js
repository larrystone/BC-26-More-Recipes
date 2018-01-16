import trimWhiteSpace from './trimWhiteSpace';

export default (User, username, userId) => {
  const promise = new Promise((resolve, reject) => {
    User
      .findOne({
        where: {
          username: {
            $iLike: trimWhiteSpace(username)
          },
          id: {
            $ne: +userId
          }
        },
        attributes: ['id']
      })
      .then((userFound) => {
        if (!userFound) {
          resolve();
        } else {
          reject({
            status: 409,
            message: 'Username already taken'
          });
        }
      });
  });
  return promise;
};
