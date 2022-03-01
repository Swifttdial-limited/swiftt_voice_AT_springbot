import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Tag,
  Steps,
  Badge,
  Popover,
  Row,
  Col,
} from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import numeral from 'numeral';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import InventoryAdjustmentForm from '../../../../components/inventory-management/inventory-adjustment/Form';
import InventoryAdjustmentView from '../../../../components/inventory-management/inventory-adjustment/View';

import styles from './index.less';

const { Description } = DescriptionList;
const { Step } = Steps;

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD';

@connect(({ accountingPreferences, inventoryAdjustment, loading }) => ({
  accountingPreferences,
  inventoryAdjustment,
  loading: loading.effects['inventoryAdjustment/query'],
}))
class InventoryAdjustmentViewWrapper extends PureComponent {
  static propTypes = {
    inventoryAdjustment: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/inventory/inventory-adjustment/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'inventoryAdjustment/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'inventoryAdjustment/purge' });
  }

  inventoryAdjustmentGenerateHandler = () => {
    const { dispatch, inventoryAdjustment } = this.props;
    const { data } = inventoryAdjustment;

    dispatch({
      type: 'inventoryAdjustment/createInventoryAdjustment',
      payload: { id: data.id }
    });
  }

  render() {
    const {
      dispatch,
      accountingPreferences,
      inventoryAdjustment
    } = this.props;
    const {
      data,
      loading,
      success
    } = inventoryAdjustment;

    const inventoryAdjustmentFormProps = {
      inventoryAdjustment: data,
      onSave(values) {
        dispatch({ type: 'inventoryAdjustment/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'inventoryAdjustment/submit', payload: { id: data.id } });
      },
      onApprove(items) {
        dispatch({ type: 'inventoryAdjustment/approve', payload: { id: data.id, items: items } });
      },
      onReject() {
        dispatch({ type: 'inventoryAdjustment/reject', payload: { id: data.id } });
      },
    };

    const inventoryAdjustmentViewProps = {
      loading,
      success,
      inventoryAdjustment: data,
    };

    const action = (
      <div />
    );

    const renderPageTitle = () => {
      switch (data.inventoryAdjustmentStatus) {
        case 'INCOMPLETE':
          return <span>Edit Inventory Adjustment</span>;
        default:
          return <span>Inventory Adjustment No: {data.inventoryAdjustmentNumber}</span>;
      }
    };

    const renderStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">INCOMPLETE</Tag>;
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

    let description = <DescriptionList className={styles.headerList} size="small" col="1" />;
    if (data.id) {
      description = (
        <Row gutter={24}>
          <Col span={16}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Location">{data.location.name}</Description>
              <Description term="Adjusted By">{data.adjustedBy ? data.adjustedBy.fullName : null}</Description>
              <Description term="Adjusted At">{data.adjustmentDate ? moment(data.adjustmentDate).format(dateFormat) : null}</Description>
            </DescriptionList>
          </Col>
          <Col span={8}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Adjustment No">{data.inventoryAdjustmentNumber}</Description>
              <Description term="Status">{renderStatusTag(data.inventoryAdjustmentStatus)}</Description>
              <Description term="Total">{accountingPreferences.data.baseCurrency !== undefined && accountingPreferences.data.baseCurrency.code} {numeral(data.approvedTotal).format('0,0.00')}</Description>
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
          { loading
              ? (
            <div>
              <Card loading={loading} style={{ marginBottom: 20 }} />
              <Card loading={loading} />
            </div>
          ) : (
            <Card>
              { data.inventoryAdjustmentStatus === 'INCOMPLETE' && <InventoryAdjustmentForm {...inventoryAdjustmentFormProps} /> }
              { data.inventoryAdjustmentStatus === 'IN_PROCESS' && <InventoryAdjustmentForm {...inventoryAdjustmentFormProps} /> }
              { data.inventoryAdjustmentStatus === 'COMPLETED' && <InventoryAdjustmentView {...inventoryAdjustmentViewProps} /> }
            </Card>
          )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default InventoryAdjustmentViewWrapper;
