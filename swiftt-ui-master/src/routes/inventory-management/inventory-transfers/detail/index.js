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
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import InventoryTransferForm from '../../../../components/inventory-management/inventory-transfer/Form';
import InventoryTransferView from '../../../../components/inventory-management/inventory-transfer/View';

import styles from './index.less';

const { Description } = DescriptionList;
const { Step } = Steps;

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ institutions, inventoryTransfer, loading }) => ({
  institutions,
  inventoryTransfer,
  loading: loading.effects['inventoryTransfer/query'],
}))
class InventoryTransferViewWrapper extends PureComponent {
  static propTypes = {
    inventoryTransfer: PropTypes.object.isRequired,
  };

  state = {
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/inventory/inventory-transfer/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'inventoryTransfer/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'inventoryTransfer/purge' });
  }

  inventoryTransferGenerateHandler = () => {
    const { dispatch, inventoryTransfer } = this.props;
    const { data } = inventoryTransfer;

    dispatch({ type: 'inventoryTransfer/createInventoryTransfer', payload: { id: data.id } });
  }

  render() {
    const { dispatch, institutions, inventoryTransfer } = this.props;
    const { data, loading, success } = inventoryTransfer;

    const { stepDirection } = this.state;

    const inventoryTransferFormProps = {
      inventoryTransfer: data,
      onSave(values) {
        dispatch({ type: 'inventoryTransfer/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'inventoryTransfer/submit', payload: { id: data.id } });
      },
      onOrderFulfilled(items) {
        dispatch({ type: 'inventoryTransfer/fulfil', payload: { id: data.id, items: items } });
      },
      onReceived(items) {
        dispatch({ type: 'inventoryTransfer/receive', payload: { id: data.id, items: items } });
      },
      onReject() {
        dispatch({ type: 'inventoryTransfer/reject', payload: { id: data.id } });
      },
    };

    const inventoryTransferViewProps = {
      loading,
      success,
      inventoryTransfer: data,
    };

    const action = (
      <div />
    );

    const renderPageTitle = () => {
      switch (data.inventoryTransferStatus) {
        case 'INCOMPLETE':
          return <span>Edit Inventory Transfer</span>;
        default:
          return <span>Inventory Transfer No: {data.inventoryTransferNumber}</span>;
      }
    };

    const renderInventoryTransferStatusTag = (status) => {
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
            <Fragment>
              { data.ordered && (
                <DescriptionList className={styles.headerList} size="small" col="1">
                  <Description term="Order By">{data.orderedBy.fullName}</Description>
                  <Description term="Ordered At">{moment(data.orderDate).format(dateTimeFormat)}</Description>
                </DescriptionList>
              )}
              { data.sent && (
                <DescriptionList className={styles.headerList} size="small" col="1">
                  <Description term="Sent By">{data.sentBy ? data.sentBy.fullName : null}</Description>
                  <Description term="Sent At">{data.sentDate ? moment(data.sentDate).format(dateTimeFormat) : null}</Description>
                </DescriptionList>
              )}
              { data.received && (
                <DescriptionList className={styles.headerList} size="small" col="1">
                  <Description term="Received By">{data.receivedBy ? data.receivedBy.fullName : null}</Description>
                  <Description term="Received At">{data.receivedDate ? moment(data.receivedDate).format(dateTimeFormat) : null}</Description>
                </DescriptionList>
              )}
            </Fragment>
          </Col>
          <Col span={8}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Created By">{data.createdBy.fullName}</Description>
              <Description term="Created At">{moment(data.createdDate).format(dateTimeFormat)}</Description>
              <Description term="Status">{renderInventoryTransferStatusTag(data.inventoryTransferStatus)}</Description>
            </DescriptionList>
          </Col>
        </Row>
      );
    }

    let currentStep = 0;
    if (data.ordered) { currentStep += 1; }
    if (data.sent) { currentStep += 2; }

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
                <div>
                  {/*
                    <Card title="Progress" style={{ marginBottom: 20 }}>
                      <Steps direction={stepDirection} progressDot current={currentStep}>
                        <Step title="Order Placement" />
                        <Step title="Order Fulfillment" />
                        <Step title="Receive Order" />
                      </Steps>
                    </Card>
                  */}
                  <Card>
                    { data.inventoryTransferStatus === 'INCOMPLETE' && <InventoryTransferForm {...inventoryTransferFormProps} /> }
                    { data.inventoryTransferStatus === 'IN_PROCESS' && <InventoryTransferForm {...inventoryTransferFormProps} /> }
                    { data.inventoryTransferStatus === 'COMPLETED' && <InventoryTransferView {...inventoryTransferViewProps} /> }
                  </Card>
                </div>
              )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default InventoryTransferViewWrapper;
