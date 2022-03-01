import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Card, Table, Button, Row, Col } from 'antd';

import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import InstitutionDetailsCard from '../../common/InstitutionDetailsCard';
import TotalAmountCard from '../../common/TotalAmountCard';
import VendorDetailsCard from '../../common/VendorDetailsCard';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function GoodsReturnView({
  goodsReturn,
}) {

  let goodsReturnSubTotal = 0;
  let goodsReturnTotal = 0;
  let goodsReturnDiscountTotal = 0;
  let goodsReturnTaxTotal = 0;

  goodsReturn.items.forEach((goodsReturnItem) => {
    let lineTotal = (goodsReturnItem.receivedQuantity * goodsReturnItem.cost);

    goodsReturnSubTotal += lineTotal;

    // less Discount
    if (goodsReturnItem.discount && lineTotal > 0) {
      lineTotal -= goodsReturnItem.discount;
      goodsReturnDiscountTotal += goodsReturnItem.discount;
    }

    // add tax
    if (goodsReturnItem.taxCode && goodsReturnItem.taxCode.formula !== 'EXEMPT') {
      goodsReturnTaxTotal += (lineTotal * goodsReturnItem.taxCode.percentage)/100;
      lineTotal += (lineTotal * goodsReturnItem.taxCode.percentage)/100;
    }

    goodsReturnTotal += lineTotal;
  });

  let goodsReturnItems = [];

  if (goodsReturn.items.length) {
    let num = 0;
    let amount = 0;
    goodsReturn.items.forEach((item) => {
      num += Number(item.quantity);
      amount += Number(item.cost);
      item.lineTotal = item.quantity * item.cost;
    });
    goodsReturnItems = goodsReturn.items.concat({
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
    if (index === goodsReturn.items.length) {
      obj.props.colSpan = 0;
    }
    return obj;
  };

  const detailedTotalAmountCardProps = {
    discountAmount: goodsReturnDiscountTotal,
    subtotalAmount: goodsReturnSubTotal,
    taxableAmount: goodsReturnSubTotal - goodsReturnDiscountTotal,
    taxAmount: goodsReturnTaxTotal,
    total: goodsReturnTotal,
  };

  const totalAmountCardProps = {
    description: 'Total',
    amount: goodsReturnTotal,
  };

  const goodsColumns = [{
    title: 'Product Code',
    dataIndex: 'id',
    key: 'id',
    render: (text, row, index) => {
      if (index < goodsReturn.items.length) {
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
    title: 'Ex / Rc Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'right',
    render: (text, row, index) => <span style={{ fontWeight: 600 }}>{row.expectedQuantity} / {row.receivedQuantity}</span>,
  }];

  return (
    <div>
      <Row gutter={24}>
        <Col span={13}>
          <VendorDetailsCard vendor={goodsReturn.vendor} />
        </Col>
        <Col span={11}>
          <TotalAmountCard {...totalAmountCardProps} />
        </Col>
      </Row>

      <hr />

      <Table
        style={{ marginBottom: 24 }}
        pagination={false}
        dataSource={goodsReturnItems}
        columns={goodsColumns}
        rowKey="id"
      />

      <br />

      <Row gutter={24}>
        <Col span={9}><DetailedTotalAmountCard {...detailedTotalAmountCardProps} /></Col>
      </Row>

      <br/>

      <Row gutter={24}>
        <Col span={12}><h5><strong>Ordered By:</strong> {goodsReturn.createdBy.fullName}</h5></Col>
        <Col span={6}><h5><strong>Signature:</strong> </h5></Col>
        <Col span={6}><h5><strong>Date:</strong> {moment(goodsReturn.createDate).local().format(dateTimeFormat)}</h5></Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}><h5><strong>Received By:</strong> {goodsReturn.createdBy.fullName}</h5></Col>
        <Col span={6}><h5><strong>Signature:</strong> </h5></Col>
        <Col span={6}><h5><strong>Date:</strong> {moment(goodsReturn.createDate).local().format(dateTimeFormat)}</h5></Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}><h5><strong>Approved By:</strong> {goodsReturn.createdBy.fullName}</h5></Col>
        <Col span={6}><h5><strong>Signature:</strong> </h5></Col>
        <Col span={6}><h5><strong>Date:</strong> {moment(goodsReturn.createDate).local().format(dateTimeFormat)}</h5></Col>
      </Row>

    </div>
  );
}

GoodsReturnView.propTypes = {
  goodsReturn: PropTypes.object.isRequired,
};

export default GoodsReturnView;
