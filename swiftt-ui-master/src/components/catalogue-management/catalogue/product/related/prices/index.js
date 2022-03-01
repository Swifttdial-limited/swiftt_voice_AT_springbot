import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import ProductPricesList from './List';

class ProductPricesView extends PureComponent {
  componentDidMount() {
    const { dispatch, product } = this.props;
    dispatch({ type: 'catalogue_prices/query', payload: { contactId: product.id } });
  }

  componentWillUnmount() {}

  render() {
    const { dispatch, catalogue_prices, product } = this.props;
    const { loading, list, pagination } = catalogue_prices;

    const priceListItemListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
      },
    };

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <ProductPricesList {...priceListItemListProps} />
        </Col>
      </Row>
    );
  }
}

ProductPricesView.propTypes = {
  product: PropTypes.object.isRequired,
  catalogue_prices: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

function mapStateToProps({ catalogue_prices }) {
  return { catalogue_prices };
}

export default connect(mapStateToProps)(ProductPricesView);
