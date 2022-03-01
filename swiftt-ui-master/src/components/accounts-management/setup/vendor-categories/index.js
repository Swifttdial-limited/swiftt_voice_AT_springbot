import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import VendorCategoryList from './List';
import VendorCategorySearch from './Search';
import VendorCategoryModal from './Modal';

@connect(({ vendorCategories, loading }) => ({
  vendorCategories,
  loading: loading.effects['vendorCategories/query'],
}))
class VendorCategoriesView extends PureComponent {
  
  static defaultProps = {
    vendorCategories: {},
  };

  static propTypes = {
    vendorCategories: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'vendorCategories/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'vendorCategories/purge' });
  }

  render() {
    const { dispatch, vendorCategories } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = vendorCategories;

    const vendorCategoryModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `vendorCategories/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'vendorCategories/hideModal' });
      },
    };

    const vendorCategoryListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'vendorCategories/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'vendorCategories/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'vendorCategories/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const vendorCategorySearchProps = {
      onSearch(fieldsValue) {},
      onAdd() {
        dispatch({
          type: 'vendorCategories/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const VendorCategoryModalGen = () => <VendorCategoryModal {...vendorCategoryModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <VendorCategorySearch {...vendorCategorySearchProps} />
            <VendorCategoryList {...vendorCategoryListProps} />

            <VendorCategoryModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default VendorCategoriesView;
