import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Card, Table, Button, Row, Col } from 'antd';

import RelatedView from './related/Related';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function VendorBillView({
  dispatch,
  institution,
  vendorBill,
}) {
  let transactionLines = [];
  if (vendorBill.transactionLines.length) {
    let num = 0;
    let amount = 0;
    vendorBill.transactionLines.forEach((item) => {
      num += Number(item.quantity);
      amount += Number(item.cost);
      item.lineTotal = item.quantity * item.cost;
    });
    transactionLines = vendorBill.transactionLines.concat({
      id: ' Total ',
      num,
      amount,
    });
  }

  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (index === vendorBill.transactionLines.length) {
      obj.props.colSpan = 0;
    }
    return obj;
  };

  const goodsColumns = [{
    title: 'Product Code',
    dataIndex: 'id',
    key: 'id',
    render: (text, row, index) => {
      if (index < vendorBill.transactionLines.length) {
        return <a href="">{text}</a>;
      }
      return {
        children: <span style={{ fontWeight: 600 }}>Total</span>,
        props: {
          colSpan: 4,
        },
      };
    },
  }, {
    title: 'Product Name ',
    dataIndex: 'product.productName',
    key: 'product.productName',
    render: renderContent,
  }, {
    title: 'Comment ',
    dataIndex: 'comment',
    key: 'comment',
    render: renderContent,
  }, {
    title: 'Unit Price',
    dataIndex: 'cost',
    key: 'cost',
    align: 'right',
    render: renderContent,
  }, {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'right',
    render: (text, row, index) => {
      if (index < vendorBill.transactionLines.length) {
        return text;
      }
      return <span style={{ fontWeight: 600 }}>{text}</span>;
    },
  }, {
    title: 'Line Total',
    dataIndex: 'lineTotal',
    key: 'lineTotal',
    align: 'right',
    render: (text, row, index) => {
      if (index < vendorBill.transactionLines.length) {
        return text;
      }
      return <span style={{ fontWeight: 600 }}>{text}</span>;
    },
  }];

  function handleGeneratePurchaseOrder(e) {
    dispatch({ type: 'vendorBill/createPurchaseOrder', payload: { id: vendorBill.id } });
  }

  return (
    <div>
      <Row gutter={24}>
        <Col style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={handleGeneratePurchaseOrder}>Generate Purchase Order</Button>
        </Col>
      </Row>
      <Card>
        <h1 style={{ textAlign: 'center', marginBottom: 20 }}><strong>INTERNAL REQUISITION</strong></h1>
        <h3 style={{ textAlign: 'center' }}><strong>{institution.companyName}</strong></h3>
        <h4 style={{ textAlign: 'center' }}>{institution.tagline}</h4>
        <h4 style={{ textAlign: 'right' }}><strong>VendorBill No:</strong> {vendorBill.vendorBillNumber}</h4>

        <hr />

        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          dataSource={transactionLines}
          columns={goodsColumns}
          rowKey="id"
        />

        <br />

        <RelatedView vendorBill={vendorBill} />

        <Row gutter={24}>
          <Col span={12}><h5><strong>Raised By:</strong> {vendorBill.requestedBy.fullName}</h5></Col>
          <Col span={6}><h5><strong>Signature:</strong> </h5></Col>
          <Col span={6}><h5><strong>Date:</strong> {moment(vendorBill.requestDate).local().format(dateTimeFormat)}</h5></Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}><h5><strong>Approved By:</strong> {vendorBill.requestedBy.fullName}</h5></Col>
          <Col span={6}><h5><strong>Signature:</strong> </h5></Col>
          <Col span={6}><h5><strong>Date:</strong> {moment(vendorBill.requestDate).local().format(dateTimeFormat)}</h5></Col>
        </Row>

      </Card>
    </div>
  );
}

VendorBillView.propTypes = {
  institution: PropTypes.object.isRequired,
  vendorBill: PropTypes.object.isRequired,
};

export default connect()(VendorBillView);
