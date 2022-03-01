import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Button, Row, Col } from 'antd';

import DescriptionList from '../../DescriptionList';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import GoodsOrderItemsTableForm from './GoodsOrderItemsTableForm';
import ServicesOrderItemsTableForm from './ServicesOrderItemsTableForm';
import RelatedView from './related/Related';
import VendorDetailsCard from '../../common/VendorDetailsCard';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function PurchaseOrderView({
  onGenerateGoodsReceiptNoteOk,
  onGenerategoodsReturnOk,
  purchaseOrder,
}) {
  let purchaseOrderSubTotal = 0;
  let purchaseOrderTotal = 0;
  let purchaseOrderDiscountTotal = 0;
  let purchaseOrderTaxTotal = 0;

  if (purchaseOrder.items.length) {
    purchaseOrder.items.forEach((purchaseOrderItem) => {
      let lineTotal = 0;
      let discount = 0;
      let tax = 0;

      lineTotal = (purchaseOrderItem.quantity * purchaseOrderItem.cost);

      purchaseOrderSubTotal += lineTotal;

      // less Discount
      if (purchaseOrderItem.discount && lineTotal > 0) {
        discount = (lineTotal * purchaseOrderItem.discount) / 100;

        lineTotal -= discount;
        purchaseOrderDiscountTotal += discount;
      }

      // add tax
      if (purchaseOrderItem.taxCode) {
        if(purchaseOrderItem.taxCode.formula === 'EXCLUSIVE') {
          tax += (lineTotal * purchaseOrderItem.taxCode.percentage) / 100;
        } else if (purchaseOrderItem.taxCode.formula === 'INCLUSIVE') {
          tax += (lineTotal * purchaseOrderItem.taxCode.percentage) / 100;
        }

        lineTotal += tax;
        purchaseOrderTaxTotal += tax;
      }

      purchaseOrderTotal += lineTotal;
    });
  }

  function handleGenerateGoodsReceiptNote() {
    onGenerateGoodsReceiptNoteOk({ id: purchaseOrder.id });
  }

  function handleGenerategoodsReturn() {
    onGenerategoodsReturnOk({ id: purchaseOrder.id });
  }

  const detailedTotalAmountCardProps = {
    discountAmount: purchaseOrderDiscountTotal,
    subtotalAmount: purchaseOrderSubTotal,
    taxableAmount: purchaseOrderSubTotal - purchaseOrderDiscountTotal,
    taxAmount: purchaseOrderTaxTotal,
    total: purchaseOrderTotal,
  };

  const itemsTableForm = (purchaseOrder.purchaseOrderType === 'GOODS') ? (
    <GoodsOrderItemsTableForm
      enableAddItem={false}
      readOnly={true}
      rowSelectionEnabled={false}
      value={purchaseOrder.items} />
  ) : (
    <ServicesOrderItemsTableForm
      enableAddItem={false}
      readOnly={true}
      rowSelectionEnabled={false}
      value={purchaseOrder.items} />
  );

  return (
    <div>
      {itemsTableForm}

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView purchaseOrder={purchaseOrder} /></Col>
        <Col span={8}><br/><DetailedTotalAmountCard {...detailedTotalAmountCardProps} /></Col>
      </Row>

      <br />

      <DescriptionList size="small" col="2">
        <Description term="Raised By">{purchaseOrder.raisedBy.fullName}</Description>
        <Description term="Raise Date">{moment(purchaseOrder.raiseDate).local().format(dateTimeFormat)}</Description>
        <Description term="Approved By">{purchaseOrder.raisedBy.fullName}</Description>
        <Description term="Approve Date">{moment(purchaseOrder.raiseDate).local().format(dateTimeFormat)}</Description>
      </DescriptionList>
    </div>
  );
}

PurchaseOrderView.propTypes = {
  onGenerateGoodsReceiptNoteOk: PropTypes.func,
  onGenerategoodsReturnOk: PropTypes.func,
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderView;
