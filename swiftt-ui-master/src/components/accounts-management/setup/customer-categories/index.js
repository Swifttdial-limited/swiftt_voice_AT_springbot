import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import CustomerCategoryList from './List';
import CustomerCategorySearch from './Search';
import CustomerCategoryModal from './Modal';

@connect(({ customerCategories, loading }) => ({
  customerCategories,
  loading: loading.effects['customerCategories/query'],
}))
class CustomerCategoriesView extends PureComponent {

  static defaultProps = {
    customerCategories: {},
  };

  static propTypes = {
    customerCategories: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customerCategories/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customerCategories/purge' });
  }

  render() {
    const { dispatch, customerCategories } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = customerCategories;

    const customerCategoryModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `customerCategories/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'customerCategories/hideModal' });
      },
    };

    const customerCategoryListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'customerCategories/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'customerCategories/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'customerCategories/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const customerCategorySearchProps = {
      onSearch() {},
      onAdd() {
        dispatch({
          type: 'customerCategories/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const CustomerCategoryModalGen = () => <CustomerCategoryModal {...customerCategoryModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <CustomerCategorySearch {...customerCategorySearchProps} />
            <CustomerCategoryList {...customerCategoryListProps} />
            <CustomerCategoryModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CustomerCategoriesView;
