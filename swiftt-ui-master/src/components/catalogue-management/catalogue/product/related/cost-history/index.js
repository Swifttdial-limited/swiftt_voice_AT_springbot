import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import ProductCostHistoryList from './List';
import { query } from '../../../../../../services/inventory/inventoryMetadata';

class ProductCostHistoryView extends PureComponent {
  static propTypes = {
    product: PropTypes.object.isRequired,
  };

  state = {
    costHistoryEntries: [],
    loading: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 0,
      total: 0,
    },
  };

  componentDidMount() {
    const { product } = this.props;
    this.fetchCostHistory(product.id);
  }

  fetchCostHistory = (product) => {
    this.setState({ loading: true });

    query({
      product: product,
    }).then((response) => {
      this.setState({ costHistoryEntries: response.content, loading: false });
    }).catch(() => {
      this.setState({ costHistoryEntries: [], loading: false });
    });
  }

  render() {
    const { costHistoryEntries, loading, pagination } = this.state;

    const priceListItemListProps = {
      dataSource: costHistoryEntries,
      loading,
      pagination,
      onPageChange(page) {
      },
    };

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <ProductCostHistoryList {...priceListItemListProps} />
        </Col>
      </Row>
    );
  }
}

export default ProductCostHistoryView;
