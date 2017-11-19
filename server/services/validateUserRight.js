
export default (Recipe, recipeId, userId) => {
  const promise = new Promise((resolve, reject) => {
    Recipe
      .findById(recipeId)
      .then((recipeFound) => {
        if (+recipeFound.userId !== +userId) {
          reject({
            status: 401,
            message: 'You cannot modify a recipe not created by You!'
          });
        }
        resolve(recipeFound);
      });
  });
  return promise;
};
