import React from 'react';
import PropTypes from 'prop-types';

import Pagination from 'rc-pagination';
import Select from 'rc-select';

import 'rc-pagination/assets/index.css';
import 'rc-select/assets/index.css';

/**
 * @description - Stateless component for rendering pagination view
 *
 * @param {object} props - Props object
 *
 * @returns {view} Paginate - Rendered view
 */
function Paginate({
  pagination, onChange, pageSize = '0', onShowSizeChange
}) {
  return (
    <Pagination
      locale={{ items_per_page: 'Items' }}
      showSizeChanger
      selectComponentClass={Select}
      onChange={onChange}
      onShowSizeChange={onShowSizeChange}
      current={Number(pagination.currentPage)}
      pageSize={Number(pageSize)}
      total={pagination.totalRecords}
      className="pagination"
      pageSizeOptions={['10', '15', '20']}
      showTotal={(total, range) =>
        `Showing ${range[0]} - ${range[1]} of ${total} items`
      }
    />
  );
}

Paginate.propTypes = {
  pagination: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  onShowSizeChange: PropTypes.func.isRequired,
  pageSize: PropTypes.string.isRequired
};

export default Paginate;
