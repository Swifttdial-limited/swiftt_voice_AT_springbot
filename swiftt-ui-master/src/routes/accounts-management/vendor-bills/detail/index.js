import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Tag, Menu, Dropdown, Icon } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import VendorBillForm from '../../../../components/accounts-management/vendor-bill/Form';

import styles from './index.less';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ institutions, vendorBill, loading }) => ({
  institutions,
  vendorBill,
  loading: loading.effects['vendorBill/query'],
}))
class VendorBillView extends PureComponent {

  static propTypes = {
    vendorBill: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/accounts/vendors-bills-and-payments/vendor-bill/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'vendorBill/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'vendorBill/purge' });
  }

  render() {
    const { dispatch, institutions, vendorBill } = this.props;
    const { data, loading, success } = vendorBill;

    const vendorBillFormProps = {
      vendorBill: data,
      onSave(values) {
        dispatch({ type: 'vendorBill/save', payload: Object.assign({}, data, values) });
      },
      onSubmit() {
        dispatch({ type: 'vendorBill/submit', payload: { id: data.id } });
      },
      onApprove(items) {
        dispatch({ type: 'vendorBill/approve', payload: { id: data.id, items: items } });
      },
      onReject() {
        dispatch({ type: 'vendorBill/reject', payload: { id: data.id } });
      },
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
      switch (data.vendorBillStatus) {
        case 'INCOMPLETE':
          return <span>Edit Vendor Bill</span>;
        default:
          return <span>Vendor Bill No: {data.vendorBillNumber}</span>;
      }
    };

    const renderVendorBillStatusTag = (status) => {
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
          <Description term="Status">{renderVendorBillStatusTag(data.vendorBillStatus)}</Description>
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
              { data.vendorBillStatus === 'INCOMPLETE' && <VendorBillForm {...vendorBillFormProps} /> }
              { data.vendorBillStatus === 'IN_PROCESS' && <VendorBillForm {...vendorBillFormProps} /> }
              { data.vendorBillStatus === 'APPROVED' && <VendorBillForm {...vendorBillFormProps} /> }
            </Card>
          )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default VendorBillView;
