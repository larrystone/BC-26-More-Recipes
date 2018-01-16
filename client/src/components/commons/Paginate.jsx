import React from 'react';
import PropTypes from 'prop-types';

import Pagination from 'rc-pagination';
import Select from 'rc-select';

import 'rc-pagination/assets/index.css';
import 'rc-select/assets/index.css';

/**
 * Stateless component for rendering pagination view
 *
 * @param {object} props
 * @returns {view} Paginate
 */
const Paginate = ({
  pagination, onChange, pageSize = '0', onShowSizeChange
}) => (
  <Pagination
    locale={{ items_per_page: 'Items' }}
    showSizeChanger
    selectComponentClass={Select}
    onChange={onChange}
    onShowSizeChange={onShowSizeChange}
    current={+pagination.currentPage}
    pageSize={+pageSize}
    total={pagination.totalRecords}
    style={{ padding: '15px' }}
    pageSizeOptions={['10', '15', '20']}
    showTotal={(total, range) =>
      `Showing ${range[0]} - ${range[1]} of ${total} items`
    }
  />
);

Paginate.propTypes = {
  pagination: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  onShowSizeChange: PropTypes.func.isRequired,
  pageSize: PropTypes.string.isRequired
};

export default Paginate;
