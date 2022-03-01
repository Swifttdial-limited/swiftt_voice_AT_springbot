import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Tag, Menu, Dropdown, Icon } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import CustomerPaymentForm from '../../../../components/accounts-management/customer-payment/Form';
import CustomerPaymentView from '../../../../components/accounts-management/customer-payment/View';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';

import styles from './index.less';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ institutions, customerPayment, loading }) => ({
  institutions,
  customerPayment,
  loading: loading.effects['customerPayment/query'],
}))
class CustomerPaymentViewWrapper extends PureComponent {
  static propTypes = {
    customerPayment: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;

    const match = pathToRegexp('/accounts/customers-and-payments/customer-payment/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'customerPayment/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'customerPayment/purge' });
  }

  makeCustomerPaymentHandler = () => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push('/accounts/customer-payments-and-payments/customer-payment/create'));
  }

  render() {
    const { dispatch, institutions, customerPayment } = this.props;
    const { data, loading, success } = customerPayment;

    const customerPaymentFormProps = {
      customerPayment: { ...data },
      onSave(values) {
        dispatch({ type: 'customerPayment/save', payload: Object.assign({}, data, values) });
      },
      onSubmit() {
        dispatch({ type: 'customerPayment/submit', payload: { id: data.id } });
      },
      onApprove(items) {
        dispatch({ type: 'customerPayment/approve', payload: { id: data.id, items: items } });
      },
      onReject() {
        dispatch({ type: 'customerPayment/reject', payload: { id: data.id } });
      },
    };

    const customerPaymentViewProps = {
      loading,
      success,
      customerPayment: data,
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
        { (data.customerPaymentStatus !== undefined && data.customerPaymentStatus === 'APPROVED') && (
          <Authorized authority="CREATE_VENDOR_PAYMENT">
            <Button icon="copy" onClick={this.makeCustomerPaymentHandler}>Create Payment</Button>
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
      switch (data.customerPaymentStatus) {
        case 'INCOMPLETE':
          return <span>Edit Customer Receipt</span>;
        default:
          return <span>Customer Receipt No: {data.customerPaymentNumber}</span>;
      }
    };

    const renderCustomerPaymentStatusTag = (status) => {
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
          <Description term="Created By">{data.createdBy.fullName}</Description>
          <Description term="Created At">{moment(data.createdDate).format(dateTimeFormat)}</Description>
          <Description term="Status">{renderCustomerPaymentStatusTag(data.customerPaymentStatus)}</Description>
          <Description term="">&nbsp;</Description>
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
          {loading ? <Card loading={loading} /> : (
            <Card>
              { data.customerPaymentStatus === 'INCOMPLETE' && <CustomerPaymentForm {...customerPaymentFormProps} />}
              { data.customerPaymentStatus === 'IN_PROCESS' && <CustomerPaymentForm {...customerPaymentFormProps} />}
              { data.customerPaymentStatus === 'APPROVED' && <CustomerPaymentView {...customerPaymentViewProps} />}
            </Card>
          ) }
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CustomerPaymentViewWrapper;
