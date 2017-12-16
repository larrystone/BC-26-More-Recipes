import { Recipe, User } from '../models';

const populatePaging = ({ count = 0, rows = [] }, currentPage, limit) => {
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / limit);
  const newRecipes = Object.assign({},
    {
      currentPage,
      currentPageSize: rows.length,
      totalPages,
      totalRecords
    }
  );
  return newRecipes;
};

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
  sortMostUpvotes({ query }, res) {
    const limit = query.limit || 10,
      currentPage = (query.page || 1),
      offset = (currentPage - 1) * limit;

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
          recipes: foundRecipes.rows
        });
      });

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
  searchAll({ query }, res) {
    const limit = query.limit || 10,
      currentPage = (query.page || 1),
      offset = (currentPage - 1) * limit;

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
          recipes: foundRecipes.rows
        });
      });

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
  searchByIngredients({ query }, res) {
    const ingredients = query.ingredients.split(' ');
    const queryClause = ingredients.map(item => ({
      ingredients: { $iLike: `%${item}%` }
    }));

    const limit = query.limit || 10,
      currentPage = (query.page || 1),
      offset = (currentPage - 1) * limit;

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
          recipes: foundRecipes.rows
        });
      });

    return this;
  }

  /**
   * Fetch list of recipes based on name supplied
   *
   * @param {any} req
   * @param {any} res
   * @returns {object} Classs instance
   * @memberof Search
   */
  searchByName({ query }, res) {
    const { name } = query;

    const limit = query.limit || 10,
      currentPage = (query.page || 1),
      offset = (currentPage - 1) * limit;

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
          return res.status(200).json({
            success: true,
            message: 'Nothing found!',
            pagination,
            recipes: []
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Recipe(s) found',
          pagination,
          recipes: foundRecipes.rows
        });
      });

    return this;
  }
}

