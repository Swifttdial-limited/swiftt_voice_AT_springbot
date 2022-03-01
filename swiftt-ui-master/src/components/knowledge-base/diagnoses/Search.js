import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Button, Row, Col } from 'antd';
import includes from 'lodash/includes';

import SearchDiagnosis from '../../ui/search';

class Search extends PureComponent {

  static defaultProps = {
    onSearch: () => {},
    field: '',
    keyword: '',
  };

  static propTypes = {
    onSearch: PropTypes.func,
    field: PropTypes.string,
    keyword: PropTypes.string,
  };

  render() {
    const { field, keyword, onSearch } = this.props;

    const searchDiagnosisProps = {
      field,
      keyword,
      size: 'large',
      select: true,
      selectOptions: [{ value: 'searchQueryParam', name: 'Search' }],
      selectProps: {
        defaultValue: field || 'searchQueryParam',
      },
      onSearch: (value) => {
        onSearch(value);
      },
    };

    return (
      <Row gutter={24}>
        <Col lg={9} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
          <SearchDiagnosis {...searchDiagnosisProps} />
        </Col>
      </Row>
    );
  }
}

export default Search;
