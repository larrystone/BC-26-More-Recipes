import multer from 'multer';
import cloudinary from 'cloudinary';

import { Recipe, Favorite, User } from '../models';
import { validateRecipeDetails } from '../middleware/validate';
import Search from './searchRecipe';
import notify from './../services/notify';
import trimWhiteSpaces from '../services/trimWhiteSpace';
import validateRights from '../services/validateRights';

cloudinary.config({
  cloud_name: 'larrystone',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only Images are allowed !'), false);
    }

    callback(null, true);
  }
}).single('image');

const uploadImage = (req, res) => {
  const promise = new Promise((resolve, reject) => {
    upload(req, res, (err) => {
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
      name, description, ingredients, direction, imageUrl, userId, res }) => {
      Recipe
        .create({
          name,
          description,
          ingredients,
          direction,
          imageUrl,
          userId
        })
        .then((createdRecipe) => {
          res.status(201).json({
            success: true,
            message: 'New Recipe created',
            recipe: createdRecipe
          });
        })
        .catch(error => res.status(500).json({
          success: false,
          message: error.message
        }));
    };

    uploadImage(req, res).then((req) => {
      let imageUrl = '';
      const name = trimWhiteSpaces(req.body.name, ' ');
      const description = trimWhiteSpaces(req.body.description, ' ');
      const ingredients = trimWhiteSpaces(req.body.ingredients, ' ');
      const direction = trimWhiteSpaces(req.body.direction, ' ');
      const { file } = req;
      const userId = req.user.id;

      const validateRecipeError =
        validateRecipeDetails(name, ingredients, direction);

      if (validateRecipeError) {
        return res.status(400).json({
          success: false,
          message: validateRecipeError
        });
      }

      if (file) {
        cloudinary.uploader.upload_stream((result) => {
          if (!result.error) {
            imageUrl = result.url;
            writeToDatabase({
              name, description, ingredients, direction, imageUrl, userId, res
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
          name, description, ingredients, direction, imageUrl, userId, res
        });
      }
    }).catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message
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
      name, description, ingredients, direction, imageUrl, recipeId, res
    }) => {
      Recipe.update({
        name,
        description,
        ingredients,
        imageUrl,
        direction
      }, {
          where: {
            id: recipeId
          },
          returning: true
        })
        .then((result) => {
          Favorite
            .findAll({
              attributes: ['userId'],
              where: { recipeId },
              include: [
                { model: User, attributes: ['email'] }
              ]
            })
            .then((foundUsers) => {
              const userEmails = foundUsers.map(user => user.User.email);
              notify(userEmails,
                'Favorite Recipe Modified',
                'One of your favorite recipes has been modified');

              res.status(201).json({
                success: true,
                message: 'Recipe record updated',
                recipe: result[1],
              });
            });
        })
        .catch(error => res.status(500).json({
          success: false,
          message: error.message
        }));
    };

    let imageUrl = '';
    uploadImage(req, res).then((req) => {
      const userId = req.user.id;
      const recipeId = req.params.recipeId || 0;
      const name = trimWhiteSpaces(req.body.name, '  ');
      const description = trimWhiteSpaces(req.body.description, '  ');
      const ingredients = trimWhiteSpaces(req.body.ingredients, '  ');
      const direction = (req.body.direction);
      const { file } = req;

      const validateRecipeError =
        validateRecipeDetails(name, ingredients,
          direction, recipeId);

      if (validateRecipeError) {
        return res.status(400).json({
          success: false,
          message: validateRecipeError
        });
      }

      validateRights(Recipe, recipeId, userId).then(() => {
        if (file) {
          cloudinary.uploader.upload_stream((result) => {
            if (!result.error) {
              imageUrl = result.url;
              updateDatabase({
                name, description, ingredients, direction, imageUrl, recipeId, res
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
            name, description, ingredients, direction, imageUrl, recipeId, res
          });
        }
      })
        .catch((error) => {
          res.status(error.status).json({
            success: false,
            message: error.message
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
  deleteRecipe(req, res) {
    const recipeId = req.params.recipeId;
    const userId = req.user.id;

    validateRights(Recipe, recipeId, userId).then(() => {
      Recipe.destroy({
        where: {
          id: recipeId
        },
      })
        .then(() => {
          // TODO delete image in cloudinary
          cloudinary.uploader.destroy('id', () => {
            res.status(205).json({
              success: true,
              message: 'Recipe Deleted!'
            });
          });
        })
        .catch(() => res.status(500).json({
          success: false,
          message: 'Error Deleting Recipe'
        }));
    }).catch((error) => {
      res.status(error.status).json({
        success: false,
        message: error.message
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
  getRecipe(req, res) {
    const recipeId = req.params.recipeId;

    Recipe
      .findOne({
        where: { id: recipeId },
        include: [
          { model: User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${recipeId}`
          });
        }

        return recipeFound.increment('viewCount');
      })
      .then(recipesFound => recipesFound.reload())
      .then(recipeLoaded => res.status(201).json({
        success: true,
        message: 'Recipe found',
        recipe: recipeLoaded
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
  getUserRecipes(req, res) {
    const userId = req.user.id;

    Recipe
      .findAll({
        where: { userId },
        include: [
          { model: User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'No User Stored Recipes found',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'User Recipes found',
          recipe: foundRecipes
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
    } else if (req.query.recipes) {
      newSearch.searchByName(req, res);
    } else if (req.query.search) {
      newSearch.searchAll(req, res);
    } else {
      Recipe
        .findAll({
          include: [
            { model: User, attributes: ['name', 'updatedAt'] }
          ]
        })
        .then((foundRecipes) => {
          if (!foundRecipes) {
            return res.status(404).json({
              success: true,
              message: 'No Stored Recipes found'
            });
          }

          return res.status(201).json({
            success: true,
            message: 'Recipes found',
            recipe: foundRecipes
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
