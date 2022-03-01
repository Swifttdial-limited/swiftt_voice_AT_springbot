import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Button,
  Card,
  Tag,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import RequisitionView from '../../../../components/procurement-management/requisition/View';

import styles from './index.less';

const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ accountingPreferences, institutions, requisition, loading }) => ({
  accountingPreferences,
  institutions,
  requisition,
  loading: loading.effects['requisition/query'],
}))
class RequisitionViewWrapper extends PureComponent {

  static propTypes = {
    requisition: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { accountingPreferences, dispatch, location } = this.props;
    const match = pathToRegexp('/procurement/requisition/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'requisition/query', payload: { id: match[1] } });

      if (accountingPreferences.data.baseCurrency == undefined)
        this.props.dispatch({ type: 'accountingPreferences/query' });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'requisition/purge' });
  }

  handleGeneratePurchaseOrder = () => {
    const { dispatch, requisition } = this.props;
    const { data } = requisition;

    dispatch({ type: 'requisition/createPurchaseOrder', payload: { id: data.id } });
  }

  render() {
    const { accountingPreferences, requisition } = this.props;
    const { data, loading, success } = requisition;

    const requisitionViewProps = {
      loading,
      success,
      requisition: data,
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
        { (data.requisitionStatus !== undefined && data.requisitionStatus === 'APPROVED') && (
          <Fragment>
            <Authorized authority="CREATE_PURCHASE_ORDERR">
              <Button icon="plus" onClick={this.handleGeneratePurchaseOrder}>Order</Button>
            </Authorized>
          </Fragment>
        )}

        <Dropdown overlay={menu}>
          <Button style={{ marginLeft: 8 }}>
            <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    );

    const renderPageTitle = () => {
      switch (data.requisitionStatus) {
        case 'INCOMPLETE':
          return <span>Edit Requisition</span>;
        default:
          return <span>Requisition No: {data.requisitionNumber}</span>;
      }
    };

    const renderRequisitionStatusTag = (status) => {
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
        <Row gutter={24}>
          <Col span={16}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Requesting Department">{data.requestingDepartment.name}</Description>
              <Description term="Requested By">{data.requestedBy.fullName}</Description>
              <Description term="Requested At">{data.requestDate !== null ? moment(data.requestDate).format(dateTimeFormat) : null}</Description>
              <Description term="Description">{data.description}</Description>
            </DescriptionList>
          </Col>
          <Col span={8}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Requisition Date">{moment(data.createdDate).format(dateFormat)}</Description>
              <Description term="Reference">{data.reference ? data.reference : null}</Description>
              <Description term="Required Date">{data.dateRequired ? moment(data.dateRequired).format(dateFormat) : null}</Description>
              <Description term="Status">{renderRequisitionStatusTag(data.requisitionStatus)}</Description>
              {/*
                <Description term="Total">{accountingPreferences.data.baseCurrency !== undefined && accountingPreferences.data.baseCurrency.code} {numeral(data.approvedTotal).format('0,0.00')}</Description>
              */}
            </DescriptionList>
          </Col>
        </Row>
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
            : <Card>
                { data.requisitionStatus === 'APPROVED' && <RequisitionView {...requisitionViewProps} /> }
              </Card> }
        </div>
      </PageHeaderLayout>
    );
  }
}

export default RequisitionViewWrapper;
