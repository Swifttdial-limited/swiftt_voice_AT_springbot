import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Tag, Menu, Dropdown, Icon } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import BankReconciliationForm from '../../../../components/accounts-management/bank-reconciliation/Form';
import BankReconciliationView from '../../../../components/accounts-management/bank-reconciliation/View';

import styles from './index.less';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD';

@connect(({ accountingPreferences, bankReconciliation, loading }) => ({
  accountingPreferences,
  bankReconciliation,
  loading: loading.effects['bankReconciliation/query'],
}))
class BankReconciliationViewWrapper extends PureComponent {

  static propTypes = {
    bankReconciliation: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/accounts/bank-reconciliation/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'bankReconciliation/query', payload: { id: match[1] } });
      dispatch({ type: 'accountingPreferences/query' });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bankReconciliation/purge' });
  }

  render() {
    const { dispatch, accountingPreferences, bankReconciliation } = this.props;
    const { data, loading, success } = bankReconciliation;

    const bankReconciliationFormProps = {
      bankReconciliation: data,
      currency: accountingPreferences.data.baseCurrency ? accountingPreferences.data.baseCurrency.code : '',
      onSave(values) {
        dispatch({ type: 'bankReconciliation/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'bankReconciliation/submit', payload: { id: data.id, items: values.items } });
      },
    };

    const bankReconciliationViewProps = {
      loading,
      success,
      bankReconciliation: data,
      currency: accountingPreferences.data.baseCurrency ? accountingPreferences.data.baseCurrency.code : '',
    };

    function handleMenuClick(e) {
      message.info('Click on menu item.');
      console.log('click', e);
    }

    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1"><Icon type="user" />Export as PDF</Menu.Item>
        <Menu.Item key="2"><Icon type="user" />Discard</Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        { (data.status !== undefined && data.status === 'INCOMPLETE') && (
          <Authorized authority="UPDATE_BANK_RECONCILIATION">
            <Button icon="edit">Edit Reconciliation</Button>
          </Authorized>
        )}

        <Dropdown overlay={menu}>
          <Button style={{ marginLeft: 8 }}>
            <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    );

    const renderPageTitle = () => {
      switch (data.status) {
        case 'INCOMPLETE':
          return <span>Edit Bank Reconciliation</span>;
        default:
          return <span>Bank Reconciliation No: {data.bankReconciliationNumber}</span>;
      }
    };

    const renderBankReconciliationStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">DRAFT</Tag>;
        case 'IN_PROCESS':
          return <Tag color="blue">IN PROCESS</Tag>;
        case 'PRE_APPROVED':
          return <Tag color="purple">PREAPPROVED</Tag>;
        case 'APPROVED':
          return <Tag color="green">APPROVED</Tag>;
        case 'REJECTED':
          return <Tag color="red">REJECTED</Tag>;
        case 'CANCELED':
          return <Tag color="red">CANCELED</Tag>;
        case 'DELETED':
          return <Tag color="red">DELETED</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    let description = <DescriptionList className={styles.headerList} size="small" col="3" />;
    if (data.id) {
      description = (
        <DescriptionList className={styles.headerList} size="small" col="3">
          <Description term="Payment Mode">{data.paymentMode.name}</Description>
          <Description term="Bank Statement Reference">{data.statementReference}</Description>
          <Description term="Bank Statement Date">{moment(data.statementEndingDate).format(dateFormat)}</Description>
          <Description term="Status">{renderBankReconciliationStatusTag(data.status)}</Description>
          <Description term="Reconciled By">{data.createdBy.fullName}</Description>
          <Description term="Reconciled At">{moment(data.creationDate).format(dateTimeFormat)}</Description>
        </DescriptionList>
      );
    }

    return (
      <PageHeaderLayout
        title={renderPageTitle()}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
        action={action}
      >
        <div className="content-inner">
          {loading
            ? <Card loading={loading} />
            : (
              <div>
                { data.status === 'INCOMPLETE' && <BankReconciliationForm {...bankReconciliationFormProps} /> }
                { data.status === 'COMPLETED' && <BankReconciliationView {...bankReconciliationViewProps} /> }
              </div>
            )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default BankReconciliationViewWrapper;
