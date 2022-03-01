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
import RequisitionForm from '../../../../components/procurement-management/requisition/Form';
import RequisitionView from '../../../../components/procurement-management/requisition/View';

import styles from './index.less';

const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ accountingPreferences, requisition, loading }) => ({
  accountingPreferences,
  requisition,
  loading: loading.effects['requisition/query'],
}))
class RequisitionViewWrapper extends PureComponent {
  static propTypes = {
    requisition: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { accountingPreferences, dispatch, location } = this.props;
    const match = pathToRegexp('/workspace/requisition/view/:id').exec(location.pathname);
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

  handleCopyToNewRequisition = () => {
    const { dispatch, requisition } = this.props;
    const { data } = requisition;

    const newRequision = {
      comment: data.comment,
      description: data.description,
      items: data.items.map((item) => {
        return {
          key: item.id,
          comment: item.comment,
          cost: item.cost,
          discount: item.discount,
          packSize: item.packSize,
          preferredVendor: item.preferredVendor,
          product: item.product,
          quantity: item.quantity,
        }
      }),
    };

    dispatch({ type: 'requisitions/purgeCurrentItem' });
    dispatch({ type: 'requisitions/setCurrentItem', payload: newRequision });

    dispatch(routerRedux.push({pathname: '/workspace/requisition/create'}));
  }

  handleGeneratePurchaseOrder = () => {
    const { dispatch, requisition } = this.props;
    const { data } = requisition;

    dispatch({ type: 'requisition/createPurchaseOrder', payload: { id: data.id } });
  }

  render() {
    const { accountingPreferences, dispatch, requisition } = this.props;
    const { data, loading, success } = requisition;

    const requisitionFormProps = {
      requisition: data,
      onSave(values) {
        const payload = Object.assign({}, data, values, { fromWorkspace: true });
        dispatch({ type: 'requisition/save', payload: payload });
      },
      onSubmit() {
        dispatch({ type: 'requisition/submit', payload: { id: data.id, fromWorkspace: true } });
      },
      onApprove(items) {
        dispatch({ type: 'requisition/approve', payload: { id: data.id, items: items, fromWorkspace: true } });
      },
      onReject() {
        dispatch({ type: 'requisition/reject', payload: { id: data.id, fromWorkspace: true } });
      },
    };

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
            <Authorized authority="CREATE_REQUISITION">
              <Button icon="copy" onClick={this.handleCopyToNewRequisition}>Copy to New</Button>
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
              <Description term="Requested At">{data.requestDate !== null ? moment(data.requestDate).format(dateFormat) : null}</Description>
              <Description term="Description">{data.description}</Description>
            </DescriptionList>
            <hr />
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Destination Department">{data.dispatchDepartment.name}</Description>
              <Description term="Destination Location">{data.dispatchedFrom.name}</Description>
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
                { data.requisitionStatus === 'INCOMPLETE' && <RequisitionForm {...requisitionFormProps} /> }
                { data.requisitionStatus === 'IN_PROCESS' && <RequisitionForm {...requisitionFormProps} /> }
                { data.requisitionStatus === 'APPROVED' && <RequisitionView {...requisitionViewProps} /> }
              </Card> }
        </div>
      </PageHeaderLayout>
    );
  }
}

export default RequisitionViewWrapper;
