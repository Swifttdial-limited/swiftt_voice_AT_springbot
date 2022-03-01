import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import BankReconciliationsList from '../../../components/accounts-management/bank-reconciliations/List';
import BankReconciliationModal from '../../../components/accounts-management/bank-reconciliations/Modal';
import BankReconciliationsSearch from '../../../components/accounts-management/bank-reconciliations/Search';

@connect(({ bankReconciliations, loading }) => ({
  bankReconciliations,
  loading: loading.effects['bankReconciliations/query'],
}))
class BankReconciliationsView extends PureComponent {

  static propTypes = {
    bankReconciliations: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bankReconciliations/query' });
  }

  render() {
    const { bankReconciliations, dispatch } = this.props;
    const {
      currentItem,
      loading,
      list,
      modalType,
      modalVisible,
      pagination,
      success
    } = bankReconciliations;

    const bankReconciliationModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `bankReconciliations/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'bankReconciliations/hideModal' });
      },
    };

    const bankReconciliationSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'bankReconciliationNumber') {
            payload.bankReconciliationNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'bankReconciliations/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'bankReconciliations/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const bankReconciliationListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'bankReconciliations/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    const BankReconciliationModalGen = () => <BankReconciliationModal {...bankReconciliationModalProps} />;

    return (
      <PageHeaderLayout
        title="Bank Reconciliations"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <BankReconciliationsSearch {...bankReconciliationSearchProps} />
          <BankReconciliationsList {...bankReconciliationListProps} />
        </div>
        <BankReconciliationModalGen />
      </PageHeaderLayout>
    );
  }
}

export default BankReconciliationsView;
