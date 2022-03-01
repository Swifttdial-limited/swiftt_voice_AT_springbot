import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import ProductList from './List';
import ProductSearch from './Search';
import ProductsImportModal from './ImportModal';
import ProductsBulkUpdateModal from './ProductsBulkUpdateModal';

@connect(({ catalogue_products, loading }) => ({
  catalogue_products,
  loading: loading.effects['catalogue_products/query'],
}))
class ProductsView extends PureComponent {
  static propTypes = {
    catalogue_products: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_products/query' });
  }

  render() {
    const { dispatch, catalogue_products } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      importModalVisible,
      productsBulkUpdateModalVisible,
    } = catalogue_products;

    const productsImportModalProps = {
      visible: importModalVisible,
      onCancel() {
        dispatch({ type: 'catalogue_products/hideImportModal' });
      },
    };

    const productsBulkUpdateModalProps = {
      visible: productsBulkUpdateModalVisible,
      onOk(data) {
        dispatch({ type: 'catalogue_products/doProductsBulkUpdate', payload: { ...data, productActionType: 'BULK_PRODUCT_UPDATE' } });
      },
      onCancel() {
        dispatch({ type: 'catalogue_products/hideProductsBulkUpdateModal' });
      },
    };

    const productListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_products/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_products/delete', payload: id });
      },
    };

    const productSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          } else if (fieldsValue.field === 'code') {
            payload.productCode = fieldsValue.keyword;
          } else if (fieldsValue.field === 'customProductCode') {
            payload.customProductCode = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_products/query',
          payload,
        });
      },
      onProductsBulkUpdate() {
        dispatch({
          type: 'catalogue_products/showProductsBulkUpdateModal',
          payload: {
            modalType: 'create',
          },
        });
      },
      onImport() {
        dispatch({
          type: 'catalogue_products/showImportModal',
        });
      },
    };

    const ProductsImportModalGen = () => <ProductsImportModal {...productsImportModalProps} />;
    const ProductsBulkUpdateModalGen = () => <ProductsBulkUpdateModal {...productsBulkUpdateModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <ProductSearch {...productSearchProps} />
            <ProductList {...productListProps} />
          </Col>
        </Row>
        <ProductsImportModalGen />
        <ProductsBulkUpdateModalGen />
      </div>
    );
  }
}

export default ProductsView;
