import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Tag, Menu, Dropdown, Icon } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import VendorPaymentForm from '../../../../components/accounts-management/vendor-payment/Form';
import VendorPaymentView from '../../../../components/accounts-management/vendor-payment/View';

import styles from './index.less';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ institutions, vendorPayment, loading }) => ({
  institutions,
  vendorPayment,
  loading: loading.effects['vendorPayment/query'],
}))
class VendorPaymentViewWrapper extends PureComponent {
  static propTypes = {
    vendorPayment: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/accounts/vendors-bills-and-payments/vendor-payment/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'vendorPayment/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'vendorPayment/purge' });
  }

  render() {
    const { dispatch, institutions, vendorPayment } = this.props;
    const { data, loading, success } = vendorPayment;

    const vendorPaymentFormProps = {
      vendorPayment: data,
      onSave(values) {
        dispatch({ type: 'vendorPayment/save', payload: Object.assign({}, data, values) });
      },
      onSubmit() {
        dispatch({ type: 'vendorPayment/submit', payload: { id: data.id } });
      },
      onApprove(items) {
        dispatch({ type: 'vendorPayment/approve', payload: { id: data.id, items: items } });
      },
      onReject() {
        dispatch({ type: 'vendorPayment/reject', payload: { id: data.id } });
      },
    };

    const vendorPaymentViewProps = {
      loading,
      success,
      vendorPayment: data,
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
        <Dropdown overlay={menu}>
          <Button style={{ marginLeft: 8 }}>
            <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    );

    const renderPageTitle = () => {
      switch (data.vendorPaymentStatus) {
        case 'INCOMPLETE':
          return <span>Edit Vendor Payment</span>;
        default:
          return <span>Vendor Payment No: {data.vendorPaymentNumber}</span>;
      }
    };

    const renderVendorPaymentStatusTag = (status) => {
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
          <Description term="Status">{renderVendorPaymentStatusTag(data.vendorPaymentStatus)}</Description>
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
              { data.vendorPaymentStatus === 'INCOMPLETE' && <VendorPaymentForm {...vendorPaymentFormProps} /> }
              { data.vendorPaymentStatus === 'IN_PROCESS' && <VendorPaymentForm {...vendorPaymentFormProps} /> }
              { data.vendorPaymentStatus === 'APPROVED' && <VendorPaymentView {...vendorPaymentViewProps} /> }
            </Card>
          )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default VendorPaymentViewWrapper;
