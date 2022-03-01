import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import TriageCategoryList from './List';
import TriageCategorySearch from './Search';
import TriageCategoryModal from './Modal';

@connect(({ triageCategories, loading }) => ({
  triageCategories,
  loading: loading.effects['triageCategories/query'],
}))
class TriageCategoriesView extends PureComponent {
  static propTypes = {
    triageCategories: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'triageCategories/query' });
  }

  render() {
    const { dispatch, triageCategories } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = triageCategories;

    const triageCategoryModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `triageCategories/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'triageCategories/hideModal' });
      },
    };

    const triageCategoryListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'triageCategories/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'triageCategories/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'triageCategories/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const triageCategorySearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'triageCategories/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'triageCategories/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const TriageCategoryModalGen = () => <TriageCategoryModal {...triageCategoryModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <TriageCategorySearch {...triageCategorySearchProps} />
            <TriageCategoryList {...triageCategoryListProps} />
            <TriageCategoryModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TriageCategoriesView;
