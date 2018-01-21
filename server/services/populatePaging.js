/**
 * @description - Populate the pagination response
 *
 * @param {object} recipe - Recipe details object
 *
 * @param {Number} currentPage - Current page
 *
 * @param {Number} limit - Page limit
 *
 * @returns {object} pagination - Pagination object
 */
const populatePaging = ({
  count = 0, rows = []
}, currentPage, limit) => {
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / limit);
  const newRecipes = Object.assign({
  },
  {
    currentPage,
    currentPageSize: rows.length,
    totalPages,
    totalRecords
  }
  );
  return newRecipes;
};

export default populatePaging;
