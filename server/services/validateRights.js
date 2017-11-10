
export default (Recipe, recipeId, userId) => {
  const promise = new Promise((resolve, reject) => {
    Recipe
      .findById(recipeId)
      .then((recipeFound) => {
        if (!recipeFound) {
          reject({
            status: 404,
            message: `No matching recipe with id: ${recipeId}`
          });
        } else if (+recipeFound.userId !== +userId) {
          reject({
            status: 401,
            message: 'You cannot modify a recipe not created by You!'
          });
        }
        resolve();
      })
      .catch(() => {
        reject({
          status: 500,
          message: 'Error Modifying Recipe'
        });
      });
  });
  return promise;
};
