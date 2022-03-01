import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Button, Card, Tag } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import ReceiptNoteForm from '../../../../components/procurement-management/receipt-note/Form';
import ReceiptNoteView from '../../../../components/procurement-management/receipt-note/View';

import styles from './index.less';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD';

@connect(({ accountingPreferences, receiptNote, loading }) => ({
  accountingPreferences,
  receiptNote,
  loading: loading.effects['receiptNote/query'],
}))
class ReceiptNoteViewWrapper extends PureComponent {
  static propTypes = {
    receiptNote: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { accountingPreferences, dispatch, location } = this.props;
    const match = pathToRegexp('/procurement/receipt-note/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'receiptNote/query', payload: { id: match[1] } });

      if (accountingPreferences.data.baseCurrency == undefined)
        this.props.dispatch({ type: 'accountingPreferences/query' });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'receiptNote/purge' });
  }

  goodsReturnGenerateHandler = () => {
    const { dispatch, receiptNote } = this.props;
    const { data } = receiptNote;

    const goodsReturn = {
      receiptNote: data,
      items: data.items.filter(item => item.approved).map(receiptNoteItem => this.convertReceiptNoteItemToGoodsReturnItem(receiptNoteItem)),
      location: data.location,
      vendor : data.vendor,
    };

    dispatch({ type: 'goodsReturn/setData', payload: goodsReturn });
    dispatch(routerRedux.push('/inventory/goods-return/create'));
  }

  convertReceiptNoteItemToGoodsReturnItem = (receiptNoteItem) => {
    const goodsReturnItem = Object.assign(
      {}, receiptNoteItem,
      {
        receiptNoteItemId: receiptNoteItem.id,
        approved: false,
        eligible: false,
        returnQuantity: 0
      });

    delete goodsReturnItem.id

    return goodsReturnItem;
  }

  render() {
    const { dispatch, accountingPreferences, receiptNote } = this.props;
    const { data, loading, success } = receiptNote;

    const receiptNoteFormProps = {
      receiptNote: data,
      onSave(values) {
        dispatch({ type: 'receiptNote/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'receiptNote/submit', payload: { id: data.id } });
      },
      onApprove(items, charges) {
        dispatch({ type: 'receiptNote/approve', payload: { id: data.id, items: items, charges: charges } });
      },
      onReject() {
        dispatch({ type: 'receiptNote/reject', payload: { id: data.id } });
      },
    };

    const receiptNoteViewProps = {
      loading,
      success,
      receiptNote: data,
    };

    const action = (
      <div>
        {(data.receiptNoteStatus !== undefined && data.receiptNoteStatus === 'APPROVED') && (
          <Fragment>
            {data.receiptNoteType === 'GOODS' && (
              <Authorized authority="CREATE_GOODS_RETURN">
                <Button icon="rollback" onClick={this.goodsReturnGenerateHandler}>Return</Button>
              </Authorized>
            )}
            <Button style={{ marginLeft: 10 }} icon="printer">Print</Button>
          </Fragment>
        )}
      </div>
    );

    const renderPageTitle = () => {
      switch (data.receiptNoteStatus) {
        case 'INCOMPLETE':
          return <span>Edit Receipt Note</span>;
        default:
          return <span>Receipt Note No: {data.receiptNoteNumber}</span>;
      }
    };

    const renderReceiptNoteStatusTag = (status) => {
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

    let description = <DescriptionList className={styles.headerList} size="small" col="2" />;
    if (data.id) {
      description = (
        <Row gutter={24}>
          <Col span={16}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Vendor Name">{data.vendor.name} {data.vendor.code ? '(' + data.vendor.code + ')' : null}</Description>
              <Description term="Vendor Address">{data.vendor.address ? data.vendor.address.streetAddress : null}</Description>
              <Description term="Vendor Phone Number">{data.vendor ? data.vendor.phoneNumber : null}</Description>
            </DescriptionList>
            <hr />
            <DescriptionList className={styles.headerList} size="small" col="1">
              {data.receiptNoteType === 'GOODS' ? (
                <Description term="Receiving Location">{data.location.name}</Description>
              ) : (
                <Description term="Cost Center">{data.costCenter.name}</Description>
              )}
              <Description term="Received By">{data.receivedBy ? data.receivedBy.fullName : null}</Description>
              <Description term="Received At">{data.receiveDate ? moment(data.receiveDate).format(dateFormat) : null}</Description>
            </DescriptionList>
          </Col>
          <Col span={8}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Receipt Date">{moment(data.createdDate).format(dateFormat)}</Description>
              <Description term="Purchase Invoice Ref">{data.purchaseInvoiceReference ? data.purchaseInvoiceReference : null}</Description>
              <Description term="Purchase Order No">{data.purchaseOrder ? data.purchaseOrder.purchaseOrderNumber : null}</Description>
              <Description term="Purchase Order Date">{data.purchaseOrder ? moment(data.purchaseOrder.raisedDate).format(dateFormat) : null}</Description>
              <Description term="Status">{renderReceiptNoteStatusTag(data.receiptNoteStatus)}</Description>
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
            : (
              <Card>
                { data.receiptNoteStatus === 'INCOMPLETE' && <ReceiptNoteForm {...receiptNoteFormProps} /> }
                { data.receiptNoteStatus === 'IN_PROCESS' && <ReceiptNoteForm {...receiptNoteFormProps} /> }
                { data.receiptNoteStatus === 'APPROVED' && <ReceiptNoteView {...receiptNoteViewProps} /> }
              </Card>
            )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default ReceiptNoteViewWrapper;
