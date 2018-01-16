import { Recipe, User } from '../models';
import { validateRecipeDetails } from '../middleware/validate';
import Search from './searchRecipe';
import trimWhiteSpaces from '../services/trimWhiteSpace';
import validateUserRight from '../services/validateUserRight';
import cloudinary, { uploadWithMulter } from '../services/uploadImage';
import populatePaging from '../services/populatePaging';

const isNamePicked = (userId, name) => {
  const promise = new Promise((resolve) => {
    Recipe
      .findOne({
        where: {
          userId,
          name: { $iLike: name }
        }
      })
      .then((recipe) => {
        if (recipe) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
  });
  return promise;
};

/**
 * Class Definition for the Recipe Object
 *
 * @export
 * @class Recipe
 */
export default class Recipes {
  /**
   * Create a new recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} - Class instance
   * @memberof Recipe
   */
  createRecipe(req, res) {
    const writeToDatabase = ({
      name, description, ingredients, procedure, imageUrl, userId, res }) => {
      isNamePicked(userId, name)
        .then((isPicked) => {
          if (isPicked) {
            return res.status(409).json({
              success: false,
              message: 'Recipe name already picked!'
            });
          }

          Recipe
            .create({
              name,
              description,
              ingredients,
              procedure,
              imageUrl,
              userId
            })
            .then((recipe) => {
              res.status(201).json({
                success: true,
                message: 'New Recipe created',
                recipe
              });
            });
        });
    };

    uploadWithMulter(req, res).then(({ file, body, user }) => {
      let imageUrl = '';
      const name = trimWhiteSpaces(body.name, ' ');
      const description = trimWhiteSpaces(body.description, ' ');
      const ingredients = trimWhiteSpaces(body.ingredients, ' ');
      const procedure = trimWhiteSpaces(body.procedure, ' ');
      const userId = user.id;

      const isRecipeInvalid =
        validateRecipeDetails(name, ingredients, procedure);

      if (isRecipeInvalid) {
        return res.status(400).json({
          success: false,
          message: isRecipeInvalid
        });
      }

      if (file) {
        cloudinary.upload_stream(({ error, url }) => {
          if (!error) {
            imageUrl = url;
            writeToDatabase({
              name, description, ingredients, procedure, imageUrl, userId, res
            });
          } else {
            res.status(503).json({
              success: false,
              message: 'Error uploading image, check your network connection'
            });
          }
        }).end(file.buffer);
      } else {
        writeToDatabase({
          name, description, ingredients, procedure, imageUrl, userId, res
        });
      }
    }).catch(({ message }) => {
      res.status(400).json({
        success: false,
        message
      });
    });
    return this;
  }

  /**
   * Modify recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  modifyRecipe(req, res) {
    const updateDatabase = ({
      name, description, ingredients, procedure, imageUrl, res, foundRecipe
    }) => {
      if (foundRecipe.name.toLowerCase() === name.toLowerCase()) {
        foundRecipe.updateAttributes({
          name,
          description,
          ingredients,
          imageUrl,
          procedure
        })
          .then(recipe => res.status(201).json({
            success: true,
            message: 'Recipe record updated',
            recipe
          }));
      } else {
        isNamePicked(foundRecipe.userId, name)
          .then((isPicked) => {
            if (isPicked) {
              return res.status(409).json({
                success: false,
                message: 'Recipe name already picked!'
              });
            }

            foundRecipe.updateAttributes({
              name,
              description,
              ingredients,
              imageUrl,
              procedure
            })
              .then(recipe => res.status(201).json({
                success: true,
                message: 'Recipe record updated',
                recipe
              }));
          });
      }
    };

    uploadWithMulter(req, res).then(({ file, user, body, params }) => {
      const userId = user.id;
      const { recipeId } = params || 0;
      const name = trimWhiteSpaces(body.name, ' ');
      const description = trimWhiteSpaces(body.description, ' ');
      const ingredients = trimWhiteSpaces(body.ingredients, ' ');
      const procedure = trimWhiteSpaces(body.procedure, ' ');

      const isRecipeInvalid =
        validateRecipeDetails(name, ingredients,
          procedure, recipeId);

      if (isRecipeInvalid) {
        return res.status(400).json({
          success: false,
          message: isRecipeInvalid
        });
      }

      validateUserRight(Recipe, recipeId, userId).then((foundRecipe) => {
        if (file) {
          cloudinary.upload_stream(({ error, url }) => {
            if (!error) {
              updateDatabase({
                name,
                description,
                ingredients,
                procedure,
                imageUrl: url,
                res,
                foundRecipe
              });
            } else {
              res.status(503).json({
                success: false,
                message: 'Error uploading image, check your network connection'
              });
            }
          }).end(file.buffer);
        } else {
          const { imageUrl } = foundRecipe;
          updateDatabase({
            name,
            description,
            ingredients,
            procedure,
            imageUrl,
            res,
            foundRecipe
          });
        }
      })
        .catch(({ status, message }) => {
          res.status(status).json({
            success: false,
            message
          });
        });
    })
      .catch(({ message }) => {
        res.status(400).json({
          success: false,
          message
        });
      });
    return this;
  }

  /**
   * Delete Recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  deleteRecipe({ params, user }, res) {
    const { recipeId } = params;

    validateUserRight(Recipe, recipeId, user.id).then(() => {
      Recipe.destroy({
        where: {
          id: recipeId
        },
      })
        .then(() => {
          // TODO delete image in cloudinary
          // cloudinary.uploader.destroy('id', () => {
          res.status(205).json({
            success: true,
            message: 'Recipe Deleted!'
          });
          // });
        });
    }).catch(({ status, message }) => {
      res.status(status).json({
        success: false,
        message
      });
    });
    return this;
  }

  /**
   * Fetch a recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  getRecipe({ params }, res) {
    const { recipeId } = params;

    Recipe
      .findOne({
        where: { id: recipeId },
        include: [
          { model: User, attributes: ['name'] }
        ]
      })
      .then(recipeFound => recipeFound.increment('viewCount'))
      .then(recipe => res.status(201).json({
        success: true,
        message: 'Recipe found',
        recipe
      }));

    return this;
  }

  /**
   * Fetch a list user owned recipes
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  getUserRecipes({ query, user }, res) {
    const limit = +query.limit || 10,
      currentPage = (+query.page || 1),
      offset = (currentPage - 1) * limit,
      userId = user.id;

    Recipe
      .findAndCountAll({
        where: { userId },
        include: [
          { model: User, attributes: ['name'] }
        ],
        limit,
        offset
      })
      .then((recipes) => {
        const pagination = populatePaging(recipes, currentPage, limit);
        if (recipes.rows.length === 0) {
          return res.status(200).json({
            success: true,
            pagination,
            message: 'Nothing found!',
            recipes: []
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Recipe(s) found',
          pagination,
          recipes: recipes.rows
        });
      });

    return this;
  }

  /**
   * Fetch all recipes in the recipebase
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  getAllRecipes(req, res) {
    const newSearch = new Search();

    if (req.query.sort === 'upvotes' && req.query.order === 'descending') {
      newSearch.sortMostUpvotes(req, res);
    } else if (req.query.ingredients) {
      newSearch.searchByIngredients(req, res);
    } else if (req.query.name) {
      newSearch.searchByName(req, res);
    } else if (req.query.search) {
      newSearch.searchAll(req, res);
    } else {
      Recipe
        .findAll({
          include: [
            { model: User, attributes: ['name'] }
          ]
        })
        .then((recipes) => {
          if (recipes.length === 0) {
            return res.status(200).json({
              success: true,
              message: 'Nothing found!',
              recipes: []
            });
          }

          return res.status(201).json({
            success: true,
            message: 'Recipe(s) found!',
            recipes
          });
        });

      return this;
    }
  }
}
