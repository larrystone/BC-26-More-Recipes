import { Recipe, User, Favorite } from '../models';
import { validateRecipeDetails } from '../middleware/inputValidation';
import { validateUserRight } from '../middleware/userValidation';
import searchRecipe from './searchRecipe';
import trimWhiteSpaces from '../services/trimWhiteSpaces';
import cloudinary, { uploadWithMulter } from '../services/uploadImage';
import populatePaging from '../services/populatePaging';
import * as Mailer from '../services/mailer';

const notify = new Mailer.default();

/**
 * @description - Check if recipe name is already picked
 *
 * @param {Number} userId - User's ID
 *
 * @param {string} recipeName - Recipe name
 *
 * @returns {Promise} isPicked - Status of request
 */
const isNamePicked = (userId, recipeName) => {
  const promise = new Promise((resolve) => {
    Recipe
      .findOne({
        where: {
          userId,
          name: { $iLike: recipeName }
        }
      })
      .then((recipe) => {
        if (recipe) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        resolve(false);
      });
  });
  return promise;
};

/**
 * @description - Class Definition for the Recipes Object
 *
 * @export
 *
 * @class Recipes
 */
export default class Recipes {
  /**
   * @description - Creates a new recipe record
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Recipes
   */
  createRecipe(req, res) {
    /**
     * @description - Adds new recipe
     *
     * @param {object} recipeData - Recipe details
     *
     * @return {void} Nothing
     */
    const addRecipe = ({
      name,
      description,
      ingredients,
      procedure,
      imageUrl,
      userId,
      res,
      imageId
    }) => {
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
              userId,
              imageId
            })
            .then((recipe) => {
              res.status(201).json({
                success: true,
                message: 'New Recipe created',
                recipe
              });
            })
            .catch(() => res.status(500).json({
              success: false,
              message: 'Error creating recipe'
            }));
        });
    };

    uploadWithMulter(req, res).then(({ file, body, user }) => {
      let imageUrl = '';
      const name = trimWhiteSpaces(body.name, ' ');
      const description = trimWhiteSpaces(body.description, ' ');
      const ingredients = trimWhiteSpaces(body.ingredients, ' ');
      const procedure = trimWhiteSpaces(body.procedure, ' ');
      const userId = user.id;

      const recipeDetailsError =
        validateRecipeDetails({ name, ingredients, procedure });

      if (recipeDetailsError.length > 0) {
        return res.status(400).json({
          success: false,
          message: recipeDetailsError
        });
      }

      if (file) {
        cloudinary.upload_stream(({ error, secure_url, public_id }) => {
          if (!error) {
            imageUrl = secure_url; //eslint-disable-line
            addRecipe({
              name,
              description,
              ingredients,
              procedure,
              imageUrl,
              userId,
              res,
              imageId: public_id
            });
          } else {
            res.status(503).json({
              success: false,
              message: 'Error uploading image, check your network connection'
            });
          }
        }).end(file.buffer);
      } else {
        addRecipe({
          name,
          description,
          ingredients,
          procedure,
          imageUrl,
          userId,
          res,
          imageId: ''
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
   * @description - Modify a recipe record
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Recipes
   */
  modifyRecipe(req, res) {
    /**
     * @description - Updates data in the database
     *
     * @param {object} recipeData - Recipe details
     *
     * @returns {void} Nothing
     */
    const updateRecipe = ({
      name,
      description,
      ingredients,
      procedure,
      imageUrl,
      imageId,
      res,
      foundRecipe
    }) => {
      foundRecipe.updateAttributes({
        name,
        description,
        ingredients,
        imageUrl,
        procedure,
        imageId
      })
        .then((recipe) => {
          Favorite
            .findAll({
              attributes: ['userId'],
              where: { id: recipe.id }
            })
            .then((favorites) => {
              const userIds = favorites
                .map(favorite => favorite.userId);

              User.findAll({
                attributes: ['email'],
                where: {
                  id: userIds
                }
              })
                .then((users) => {
                  const userEmails = users
                    .map(user => user.userId);

                  notify.send({
                    recipe,
                    type: 'favorite',
                    subject: 'Favorite recipe updated',
                    email: userEmails
                  });
                });
            });

          return res.status(200).json({
            success: true,
            message: 'Recipe record updated',
            recipe
          });
        })
        .catch((/* error */) => res.status(500).json({
          success: false,
          message: 'Error updating recipe'
        }));
    };

    /**
    * @description - Check if recipe name is already picked
    *
    * @param {Number} userId - User's ID
    *
    * @param {string} recipeName - Recipe name
    *
    * @returns {Promise} isPicked - Status of request
    */
    const verifyNameChange = ({
      name,
      description,
      ingredients,
      procedure,
      imageUrl,
      imageId,
      res,
      foundRecipe
    }) => {
      if (foundRecipe.name.toLowerCase() === name.toLowerCase()) {
        updateRecipe({
          name,
          description,
          ingredients,
          procedure,
          imageUrl,
          imageId,
          res,
          foundRecipe
        });
      } else {
        isNamePicked(foundRecipe.userId, name)
          .then((isPicked) => {
            if (isPicked) {
              return res.status(409).json({
                success: false,
                message: 'Recipe name already picked!'
              });
            }
            updateRecipe({
              name,
              description,
              ingredients,
              procedure,
              imageUrl,
              imageId,
              res,
              foundRecipe
            });
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

      const validateRecipeError =
        validateRecipeDetails({
          name,
          ingredients,
          procedure,
          recipeId
        });

      if (validateRecipeError.length > 0) {
        return res.status(400).json({
          success: false,
          message: validateRecipeError
        });
      }

      validateUserRight(recipeId, userId).then((foundRecipe) => {
        if (file) {
          cloudinary.upload_stream(({ error, secure_url, public_id }) => {
            if (!error) {
              cloudinary.destroy(foundRecipe.imageId, () => {
              });
              verifyNameChange({
                name,
                description,
                ingredients,
                procedure,
                imageId: public_id,
                imageUrl: secure_url,
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
          const { imageUrl, imageId } = foundRecipe;
          verifyNameChange({
            name,
            description,
            ingredients,
            procedure,
            imageUrl,
            imageId,
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
   * @description - Delete a Recipe record
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Recipes
   */
  deleteRecipe({ params, user }, res) {
    const { recipeId } = params;

    validateUserRight(recipeId, user.id).then(() => {
      Recipe.findOne({
        where: {
          id: recipeId
        }
      })
        .then((recipe) => {
          recipe.destroy()
            .then(() => {
              cloudinary.destroy(recipe.imageId);

              res.status(200).json({
                success: true,
                message: 'Recipe Deleted!'
              });
            });
        })
        .catch(() => {
          res.status(200).json({
            success: false,
            message: 'Error deleting recipe'
          });
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
   * @description - Fetch a recipe record
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Recipes
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
      .then(recipe => res.status(200).json({
        success: true,
        message: 'Recipe found',
        recipe
      }))
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching recipe'
      }));

    return this;
  }

  /**
   * @description - Fetch a list user owned recipes
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Recipes
   */
  getUserRecipes({ query, user }, res) {
    const limit = Number(query.limit) || 10;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;
    const userId = user.id;

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
          return res.status(404).json({
            success: true,
            pagination,
            message: 'Nothing found!',
            recipes: []
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Recipe(s) found',
          pagination,
          recipes: recipes.rows
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching recipes'
      }));

    return this;
  }

  /**
   * @description - Fetch all recipes in the recipebase
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Recipes
   */
  getAllRecipes(req, res) {
    const newSearch = new searchRecipe();

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
            return res.status(404).json({
              success: true,
              message: 'Nothing found!',
              recipes: []
            });
          }

          return res.status(200).json({
            success: true,
            message: 'Recipe(s) found!',
            recipes
          });
        })
        .catch((/* error */) => res.status(500).json({
          success: false,
          message: 'Error fetching recipes'
        }));

      return this;
    }
  }
}
