import multer from 'multer';
import cloudinary from 'cloudinary';

import { Recipe, User } from '../models';
import { validateRecipeDetails } from '../middleware/validate';
import Search from './searchRecipe';
import trimWhiteSpaces from '../services/trimWhiteSpace';
import validateUserRights from '../services/validateRights';

cloudinary.config({
  cloud_name: 'larrystone',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadWithMulter = (req, res) => {
  const promise = new Promise((resolve, reject) => {
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 200 * 1024 * 1024, files: 1 },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(new Error('Only Images are allowed !'), false);
        }

        callback(null, true);
      }
    }).single('image')(req, res, (err) => {
      if (err) {
        reject(err);
      }
      resolve(req);
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
        })
        .catch(({ message }) => res.status(500).json({
          success: false,
          message
        }));
    };

    uploadWithMulter(req, res).then(({ file, body, user }) => {
      let imageUrl = '';
      const name = trimWhiteSpaces(body.name, ' ');
      const description = trimWhiteSpaces(body.description, ' ');
      const ingredients = trimWhiteSpaces(body.ingredients, ' ');
      const procedure = trimWhiteSpaces(body.procedure, ' ');
      const userId = user.id;

      const validateRecipeError =
        validateRecipeDetails(name, ingredients, procedure);

      if (validateRecipeError) {
        return res.status(400).json({
          success: false,
          message: validateRecipeError
        });
      }

      if (file) {
        cloudinary.uploader.upload_stream(({ error, url }) => {
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
      name, description, ingredients, procedure, imageUrl, recipeId, res
    }) => {
      Recipe.update({
        name,
        description,
        ingredients,
        imageUrl,
        procedure
      }, {
          where: {
            id: recipeId
          },
          returning: true
        })
        .then((result) => {
          res.status(201).json({
            success: true,
            message: 'Recipe record updated',
            recipe: result[1],
          });
        })
        .catch(() => res.status(500).json({
          success: false,
          message: 'Unable to modify recipe'
        }));
    };

    uploadWithMulter(req, res).then(({ file, user, body, params }) => {
      const userId = user.id;
      const { recipeId } = params || 0;
      const name = trimWhiteSpaces(body.name, '  ');
      const description = trimWhiteSpaces(body.description, '  ');
      const ingredients = trimWhiteSpaces(body.ingredients, '  ');
      const procedure = trimWhiteSpaces(body.procedure, '  ');

      const validateRecipeError =
        validateRecipeDetails(name, ingredients,
          procedure, recipeId);

      if (validateRecipeError) {
        return res.status(400).json({
          success: false,
          message: validateRecipeError
        });
      }

      validateUserRights(Recipe, recipeId, userId).then(({ imageUrl }) => {
        if (file) {
          cloudinary.uploader.upload_stream(({ error, url }) => {
            if (!error) {
              imageUrl = url;
              updateDatabase({
                name, description, ingredients, procedure, imageUrl, recipeId, res
              });
            } else {
              res.status(503).json({
                success: false,
                message: 'Error uploading image, check your network connection'
              });
            }
          }).end(file.buffer);
        } else {
          updateDatabase({
            name, description, ingredients, procedure, imageUrl, recipeId, res
          });
        }
      })
        .catch(({ status, message }) => {
          res.status(status).json({
            success: false,
            message
          });
        });
    }).catch((err) => {
      res.status(400).json(err);
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

    validateUserRights(Recipe, recipeId, user.id).then(() => {
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
        })
        .catch(() => res.status(500).json({
          success: false,
          message: 'Error Deleting Recipe'
        }));
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
      .then(recipesFound => recipesFound.reload())
      .then(recipe => res.status(201).json({
        success: true,
        message: 'Operation Successful',
        recipe
      }))
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to fetch recipes'
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
  getUserRecipes({ user }, res) {
    const userId = user.id;

    Recipe
      .findAll({
        where: { userId },
        include: [
          { model: User, attributes: ['name'] }
        ]
      })
      .then((recipe) => {
        if (!recipe) {
          return res.status(404).json({
            success: true,
            message: 'No User Stored Recipes found',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Operation Successful',
          recipe
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to get user recipes'
      }));

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
        .then((recipe) => {
          if (!recipe) {
            return res.status(404).json({
              success: true,
              message: 'No Stored Recipes found'
            });
          }

          return res.status(201).json({
            success: true,
            message: 'Operation Successful',
            recipe
          });
        })
        .catch(() => res.status(500).json({
          success: false,
          message: 'Unable to fetch recipes'
        }));

      return this;
    }
  }
}
