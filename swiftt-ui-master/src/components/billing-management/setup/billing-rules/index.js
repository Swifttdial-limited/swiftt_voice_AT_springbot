import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import BillingRuleList from './List';
import BillingRuleSearch from './Search';
import BillingRuleModal from './Modal';

@connect(({ billingRules }) => ({
  billingRules,
}))
class BillingRulesView extends PureComponent {

  static propTypes = {
    billingRules: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'billingRules/query' });
  }

  render() {
    const { dispatch, billingRules } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = billingRules;

    const billingRuleModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `billingRules/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'billingRules/hideModal' });
      },
    };

    const billingRuleListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'billingRules/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'billingRules/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'billingRules/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const billingRuleSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'productName') { payload.searchQueryParam = fieldsValue.keyword; }
        }
        dispatch({ type: 'billingRules/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'billingRules/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const BillingRuleModalGen = () => <BillingRuleModal {...billingRuleModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <BillingRuleSearch {...billingRuleSearchProps} />
            <BillingRuleList {...billingRuleListProps} />
            <BillingRuleModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default BillingRulesView;
