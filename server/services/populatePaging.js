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
