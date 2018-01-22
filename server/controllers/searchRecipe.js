import { Recipe, User } from '../models';
import populatePaging from '../services/populatePaging';

/**
 * @description - Class Definition for the Search Recipe Object
 *
 * @export
 *
 * @class Search
 */
export default class Search {
  /**
   * @description - Fetch list of recipes ordered
   * (descending) by number of upvotes
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Search
   */
  sortMostUpvotes({ query }, res) {
    const limit = Number(query.limit) || 10;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;

    Recipe
      .findAndCountAll({
        include: [
          { model: User, attributes: ['name'] }
        ],
        order: [
          ['upvotes', 'DESC']
        ],
        limit,
        offset
      })
      .then((foundRecipes) => {
        const pagination = populatePaging(foundRecipes, currentPage, limit);
        if (foundRecipes.rows.length === 0) {
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
          recipes: foundRecipes.rows
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching recipes'
      }));

    return this;
  }

  /**
   * @description - Search for recipe by Recipe name,
   * Ingredients or Name of User
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Search
   */
  searchAll({ query }, res) {
    const limit = Number(query.limit) || 10;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;

    const { search } = query;
    const ingredClause = search.split(' ').map(item => ({
      ingredients: { $iLike: `%${item}%` }
    }));
    const nameClause = search.split(' ').map(item => ({
      name: { $iLike: `%${item}%` }
    }));

    Recipe
      .findAndCountAll({
        where: {
          $or: ingredClause.concat(nameClause)
        },
        include: [
          { model: User, attributes: ['name'] }
        ],
        limit,
        offset
      })
      .then((foundRecipes) => {
        const pagination = populatePaging(foundRecipes, currentPage, limit);
        if (foundRecipes.rows.length === 0) {
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
          recipes: foundRecipes.rows
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching recipes'
      }));

    return this;
  }

  /**
   * @description - Fetch list of recipes based on ingredients supplied
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Search
   */
  searchByIngredients({ query }, res) {
    const ingredients = query.ingredients.split(' ');
    const queryClause = ingredients.map(item => ({
      ingredients: { $iLike: `%${item}%` }
    }));

    const limit = Number(query.limit) || 10;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;

    Recipe
      .findAndCountAll({
        where: {
          $or: queryClause
        },
        include: [
          { model: User, attributes: ['name'] }
        ],
        order: [
          ['upvotes', 'DESC']
        ],
        limit,
        offset
      })
      .then((foundRecipes) => {
        const pagination = populatePaging(foundRecipes, currentPage, limit);
        if (foundRecipes.rows.length === 0) {
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
          recipes: foundRecipes.rows
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching recipes'
      }));

    return this;
  }

  /**
   * @description - Fetch list of recipes based on name supplied
   *
   * @param {any} req - HTTP request
   *
   * @param {any} res - HTTP response
   *
   * @return {object} this - Classs instance
   *
   * @memberof Search
   */
  searchByName({ query }, res) {
    const { name } = query;

    const limit = Number(query.limit) || 10;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;

    Recipe
      .findAndCountAll({
        where: {
          name: { $iLike: `%${name}%` }
        },
        include: [
          { model: User, attributes: ['name'] }
        ],
        order: [
          ['upvotes', 'DESC']
        ],
        limit,
        offset
      })
      .then((foundRecipes) => {
        const pagination = populatePaging(foundRecipes, currentPage, limit);
        if (foundRecipes.rows.length === 0) {
          return res.status(404).json({
            success: true,
            message: 'Nothing found!',
            pagination,
            recipes: []
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Recipe(s) found',
          pagination,
          recipes: foundRecipes.rows
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching recipes'
      }));

    return this;
  }
}

