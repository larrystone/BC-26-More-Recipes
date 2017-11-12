import { Recipe, User } from '../models';

const populatePaging = ({ count, rows }, currentPage, limit) => {
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
          { model: User, attributes: ['name', 'updatedAt'] }
        ],
        order: [
          ['upvotes', 'DESC']
        ],
        limit,
        offset
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'No Stored Recipes found',
          });
        }

        const pagination = populatePaging(foundRecipes, currentPage, limit);
        return res.status(201).json({
          success: true,
          message: 'Operation Successful',
          pagination,
          recipes: foundRecipes.rows
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to fetch recipes'
      }));

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
    const { search } = req.query;

    Recipe
      .findAll({
        where: {
          $or: [
            {
              name: {
                $iLike: `%${search}%`
              }
            },
            {
              ingredients: {
                $iLike: `%${search}%`
              }
            }
          ]
        },
        include: [
          { model: User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        results = foundRecipes.slice(0);
      })
      .then(() => {
        User
          .findAll({
            attributes: ['name'],
            where: {
              $or: [
                {
                  name: {
                    $iLike: `%${search}%`
                  }
                },
                {
                  username: {
                    $iLike: search
                  }
                },
                {
                  email: {
                    $iLike: search
                  }
                },
              ]
            },
            include: [
              { model: Recipe }
            ]
          })
          .then(recipes => res.status(201).json({
            success: true,
            message: 'Recipe(s) found',
            recipe: results.concat(recipes)
          }));
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to search recipes'
      }));

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
          { model: User, attributes: ['name', 'updatedAt'] }
        ],
        order: [
          ['upvotes', 'DESC']
        ],
        limit,
        offset
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'No Stored Recipes found',
          });
        }

        const pagination = populatePaging(foundRecipes, currentPage, limit);
        return res.status(201).json({
          success: true,
          message: 'Operation Successful',
          pagination,
          recipes: foundRecipes.rows
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to search recipes'
      }));

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
          { model: User, attributes: ['name', 'updatedAt'] }
        ],
        order: [
          ['upvotes', 'DESC']
        ],
        limit,
        offset
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'No Stored Recipes found',
          });
        }

        const pagination = populatePaging(foundRecipes, currentPage, limit);
        return res.status(201).json({
          success: true,
          message: 'Operation Successful',
          pagination,
          recipes: foundRecipes.rows
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Unable to search recipes'
      }));

    return this;
  }
}

