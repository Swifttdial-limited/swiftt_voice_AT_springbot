import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import BillingGroupList from './List';
import BillingGroupSearch from './Search';
import BillingGroupModal from './Modal';

@connect(({ billingGroups }) => ({
  billingGroups,
}))
class BillingGroupsView extends PureComponent {
  static propTypes = {
    billingGroups: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'billingGroups/query' });
  }

  render() {
    const { dispatch, billingGroups } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = billingGroups;

    const billingGroupModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `billingGroups/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'billingGroups/hideModal' });
      },
    };

    const billingGroupListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'billingGroups/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'billingGroups/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'billingGroups/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const billingGroupSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'productName') { payload.searchQueryParam = fieldsValue.keyword; }
        }
        dispatch({ type: 'billingGroups/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'billingGroups/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const BillingGroupModalGen = () => <BillingGroupModal {...billingGroupModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <BillingGroupSearch {...billingGroupSearchProps} />
            <BillingGroupList {...billingGroupListProps} />
            <BillingGroupModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default BillingGroupsView;
