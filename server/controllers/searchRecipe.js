import models from '../models';

const recipe = models.Recipe;
const user = models.User;

/**
 * Class Definition for the Search Recipe Object
 *
 * @export
 * @class Search
 */
export default class Search {
  /**
   * Fetch list of recipes ordered (descending) by number of upvotes
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Search
   */
  sortMostUpvotes(req, res) {
    recipe
      .findAll({
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ],
        order: [
          ['upvotes', 'DESC']
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'No Stored Recipes found',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Recipe(s) found',
          data: foundRecipes });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to fetch recipes' }));

    return this;
  }

  /**
   * Search for recipe by Recipe name, Ingredients or Name of User
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Search
   */
  searchAll(req, res) {
    let results;
    const searchTerm = req.query.search;

    recipe
      .findAll({
        where: {
          $or: [
            { name: {
              $iLike: `%${searchTerm}%` }
            },
            { ingredients: {
              $iLike: `%${searchTerm}%` }
            }
          ]
        },
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        results = foundRecipes.slice(0);
      })
      .then(() => {
        user
          .findAll({
            attributes: ['name'],
            where: {
              $or: [
                { name: {
                  $iLike: `%${searchTerm}%` }
                },
                { username: {
                  $iLike: searchTerm }
                },
                { email: {
                  $iLike: searchTerm }
                },
              ]
            },
            include: [
              { model: models.Recipe }
            ]
          })
          .then(data => res.status(201).json({
            success: true,
            message: 'Recipe(s) found',
            data: results.concat(data) }));
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to search recipes' }));

    return this;
  }

  /**
   * Fetch list of recipes based ingredients supplied
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Search
   */
  searchByIngredients(req, res) {
    const ingredients = req.query.ingredients.split(' ');

    const queryClause = ingredients.map(item => ({
      ingredients: { $iLike: `%${item}%` } }));

    recipe
      .findAll({
        where: {
          $or: queryClause
        },
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'Nothing found',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Recipe(s) found',
          data: foundRecipes,
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to search recipes' }));

    return this;
  }
}
