import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row,
  Col,
  Button,
  Card,
  Tag,
  Menu,
  Dropdown,
  Icon,
  message,
  Modal,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PurchaseOrderForm from '../../../../components/procurement-management/purchase-order/Form';
import PurchaseOrderView from '../../../../components/procurement-management/purchase-order/View';
import { base64ToArrayBuffer } from '../../../../utils/utils';
import { printPurchaseOrder } from '../../../../services/procurement/purchaseOrders';

import styles from './index.less';

const confirm = Modal.confirm;
const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ accountingPreferences, institutions, purchaseOrder, loading }) => ({
  accountingPreferences,
  institutions,
  purchaseOrder,
  loading: loading.effects['purchaseOrder/query'],
}))
class PurchaseOrderViewWrapper extends PureComponent {
  static propTypes = {
    purchaseOrder: PropTypes.object.isRequired,
  };

  state = {
    printBtnloading: false,
  };

  componentDidMount() {
    const { accountingPreferences, dispatch, location } = this.props;
    const match = pathToRegexp('/procurement/purchase-order/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'purchaseOrder/query', payload: { id: match[1] } });

      if (accountingPreferences.data.baseCurrency == undefined)
        this.props.dispatch({ type: 'accountingPreferences/query' });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'purchaseOrder/purge' });
  }

  closePurchaseOrderHandler = () => {
    const { dispatch, purchaseOrder } = this.props;

    confirm({
      title: 'Close purchase order?',
      onOk() {
        dispatch({
          type: 'purchaseOrder/close',
          payload: { id: purchaseOrder.data.id },
        });
      },
    });
  }

  openPurchaseOrderHandler = () => {
    const { dispatch, purchaseOrder } = this.props;

    confirm({
      title: 'Open purchase order?',
      onOk() {
        dispatch({
          type: 'purchaseOrder/open',
          payload: { id: purchaseOrder.data.id },
        });
      },
    });
  }

  handleCopyToNewPurchaseOrder = () => {
    const { dispatch, purchaseOrder } = this.props;
    const { data } = purchaseOrder;

    const newPurchaseOrder = {
      vendor: data.vendor,
      purchaseOrderType: data.orderType,
      comment: data.comment,
      description: data.description,
      items: data.items.map((item) => {
        return {
          key: item.id,
          comment: item.comment,
          cost: item.cost,
          packSize: item.packSize,
          product: item.product,
          quantity: item.quantity,
          discount: item.discount,
          taxCode: item.taxCode,
        }
      }),
    };

    dispatch({ type: 'purchaseOrders/purgeCurrentItem' });
    dispatch({ type: 'purchaseOrders/setCurrentItem', payload: newPurchaseOrder });

    dispatch(routerRedux.push({pathname: '/procurement/purchase-order/create'}));
  }

  handleGenerateReceiptNote = () => {
    const { dispatch, purchaseOrder } = this.props;
    const { data } = purchaseOrder;

    // convert purchaseOrder to GRN
    const receiptNote = {
      receiptNoteType: data.purchaseOrderType,
      vendor: data.vendor,
      purchaseOrder: data,
      items: data.items
        .filter(item => item.approved)
        .filter(item => item.quantity - item.totalReceivedQuantity != 0)
        .map(item => {
        return {
          key: item.id,
          packSize: item.packSize,
          discount: item.discount,
          taxCode: item.taxCode,
          cost: item.cost,
          debitAccount: item.product ? item.product.stockAccount : null,
          product: item.product,
          description: item.description,
          expectedQuantity: item.quantity - item.totalReceivedQuantity,
          receivedQuantity: item.quantity - item.totalReceivedQuantity,
          minimumExpectedQuantity: item.quantity,
          maximumExpectedQuantity: item.quantity,
          purchaseOrderItemId: item.id,
        };
      }),
    };

    if(receiptNote.items.length > 0) {
      // push it to GoodsReceiptNote currentItem
      //dispatch({ type: 'goodsReceiptNotes/purgeCurrentItem' });
      dispatch({
        type: 'receiptNotes/setCurrentItem' ,
        payload: receiptNote
      });

      // routeRedux to new goods receipt note form
      dispatch(routerRedux.push({pathname: '/procurement/receipt-note/create'}));
    } else {
      message.error('Sorry. Order fully received');
    }
  }

  handlePrint = () => {
    const { purchaseOrder } = this.props;
    const { data } = purchaseOrder;
    console.log(data);
    if (data.id) {
      this.setState({ printBtnloading: true });
      printPurchaseOrder({
        purchaseOrderId: data.id,
        format: 'PDF',
      }).then((response) => {
        const blob = new Blob([base64ToArrayBuffer(response)], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        // Open the URL on new Window
        window.open(fileURL);
        this.setState({ printBtnloading: false });
      }).catch((_e) => {
        this.setState({ printBtnloading: false });
      });
    }
  }

  render() {
    const { accountingPreferences, dispatch, institutions, purchaseOrder } = this.props;
    const { data, loading, success } = purchaseOrder;
    const { printBtnloading } = this.state;

    const purchaseOrderFormProps = {
      purchaseOrder: data,
      onSave(values) {
        dispatch({ type: 'purchaseOrder/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'purchaseOrder/submit', payload: { id: data.id } });
      },
      onApprove(items) {
        dispatch({ type: 'purchaseOrder/approve', payload: { id: data.id, items } });
      },
      onReject() {
        dispatch({ type: 'purchaseOrder/reject', payload: { id: data.id } });
      },
    };

    const purchaseOrderViewProps = {
      loading,
      success,
      purchaseOrder: data,
    };

    function handleMenuClick(e) {
      message.info('Click on menu item.');
      console.log('click', e);
    }

    const renderPageTitle = () => {
      switch (data.purchaseOrderStatus) {
        case 'INCOMPLETE':
          return <span>Edit Purchase Order</span>;
        default:
          return <span>Purchase Order No: {data.purchaseOrderNumber}</span>;
      }
    };

    const renderPurchaseOrderStatusTag = (status) => {
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

    const action = (
      <div>
        {(data.purchaseOrderStatus !== undefined && data.purchaseOrderStatus === 'APPROVED') && (
          <Fragment>
            {!data.closed && (
              <Authorized authority="CREATE_DIRECT_GOODS_RECEIPT">
                <Button icon="tags-o" onClick={this.handleGenerateReceiptNote}>Receive</Button>
              </Authorized>
            )}

            <Authorized authority="CREATE_DIRECT_PURCHASE_ORDER">
              <Button icon="copy" onClick={this.handleCopyToNewPurchaseOrder}>Copy to New</Button>
            </Authorized>

            {data.closed ? (
              <Authorized authority="OPEN_PURCHASE_ORDER">
                <Button icon="unlock" onClick={this.openPurchaseOrderHandler}>Open</Button>
              </Authorized>
            ) : (
              <Authorized authority="CLOSE_PURCHASE_ORDER">
                <Button icon="lock" onClick={this.closePurchaseOrderHandler}>Close</Button>
              </Authorized>
            )}

            <Button style={{ marginLeft: 10 }} icon="printer" onClick={this.handlePrint}>Print</Button>
          </Fragment>
        )}
      </div>
    );

    let description = <DescriptionList className={styles.headerList} size="small" col="3" />;
    if (data.id) {
      description = (
        <Row gutter={24}>
          <Col span={16}>
            {data.vendor ? (
              <Fragment>
                <DescriptionList className={styles.headerList} size="small" col="1">
                  <Description term="Vendor Name">{data.vendor.name} {data.vendor.code ? '(' + data.vendor.code + ')' : null}</Description>
                  <Description term="Vendor Address">{data.vendor.address ? data.vendor.address.streetAddress : null}</Description>
                  <Description term="Vendor Phone Number">{data.vendor ? data.vendor.phoneNumber : null}</Description>
                </DescriptionList>
              </Fragment>
            ) : (
              <DescriptionList className={styles.headerList} size="small" col="1">
                <Description term="Vendor Name"></Description>
                <Description term="Vendor Address"></Description>
                <Description term="Vendor Phone Number"></Description>
              </DescriptionList>
            )}
            <hr />
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Raised By">{data.raisedBy.fullName}</Description>
              <Description term="Raised At">{data.raisedDate ? moment(data.raisedDate).format(dateTimeFormat) : null}</Description>
            </DescriptionList>
          </Col>
          <Col span={8}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Purchase Order Date">{moment(data.createdDate).format(dateFormat)}</Description>
              <Description term="Reference">{data.reference ? data.reference : null}</Description>
              <Description term="Payment Terms">{data.paymentTerms ? data.paymentTerms.name : null}</Description>
              <Description term="Planned Delivery Date">{data.plannedDeliveryDate ? moment(data.plannedDeliveryDate).format(dateFormat) : null}</Description>
              <Description term="Status">{renderPurchaseOrderStatusTag(data.purchaseOrderStatus)}</Description>
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
          {loading
            ? <Card loading={loading} />
            : <Card>
                { data.purchaseOrderStatus === 'INCOMPLETE' && <PurchaseOrderForm {...purchaseOrderFormProps} /> }
                { data.purchaseOrderStatus === 'IN_PROCESS' && <PurchaseOrderForm {...purchaseOrderFormProps} /> }
                { data.purchaseOrderStatus === 'APPROVED' && <PurchaseOrderView {...purchaseOrderViewProps} /> }
              </Card>
            }
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PurchaseOrderViewWrapper;
