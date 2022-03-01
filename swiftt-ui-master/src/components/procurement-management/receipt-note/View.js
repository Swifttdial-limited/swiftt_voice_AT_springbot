import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Card, Table, Button, Row, Col } from 'antd';

import ChargesItemsTableForm from '../../common/charges/ChargesItemsTableForm';
import DescriptionList from '../../DescriptionList';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import GoodsReceiptNoteItemsTableForm from './GoodsReceiptNoteItemsTableForm';
import RelatedView from './related/Related';
import ServicesReceiptNoteItemsTableForm from './ServicesReceiptNoteItemsTableForm';
import VendorDetailsCard from '../../common/VendorDetailsCard';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function ReceiptNoteView({
  receiptNote,
}) {

  let receiptNoteSubTotal = 0;
  let receiptNoteTotal = 0;
  let receiptNoteDiscountTotal = 0;
  let receiptNoteTaxTotal = 0;

  receiptNote.items.filter(item => item.approved).forEach((receiptNoteItem) => {
    let lineTotal = 0;
    let discount = 0;
    let tax = 0;

    lineTotal = (receiptNoteItem.receivedQuantity * receiptNoteItem.cost);

    receiptNoteSubTotal += lineTotal;

    // less Discount
    if (receiptNoteItem.discount && lineTotal > 0) {
      discount = (lineTotal * receiptNoteItem.discount) / 100;

      lineTotal -= discount;
      receiptNoteDiscountTotal += discount;
    }

    // add tax
    if (receiptNoteItem.taxCode) {
      if(receiptNoteItem.taxCode.formula === 'EXCLUSIVE') {
        tax += (lineTotal * receiptNoteItem.taxCode.percentage) / 100;
      } else if (receiptNoteItem.taxCode.formula === 'INCLUSIVE') {
        tax += (lineTotal * receiptNoteItem.taxCode.percentage) / 100;
      }

      lineTotal += tax;
      receiptNoteTaxTotal += tax;
    }

    receiptNoteTotal += lineTotal;
  });

  const detailedTotalAmountCardProps = {
    discountAmount: receiptNoteDiscountTotal,
    subtotalAmount: receiptNoteSubTotal,
    taxableAmount: receiptNoteSubTotal - receiptNoteDiscountTotal,
    taxAmount: receiptNoteTaxTotal,
    total: receiptNoteTotal + receiptNote.approvedChargesTotal,
  };

  const totalAmountCardProps = {
    description: 'Total',
    amount: receiptNoteTotal,
  };

  return (
    <div>
      <fieldset style={{ marginBottom: 20 }}>
        <legend>Items</legend>
        {receiptNote.receiptNoteType === 'GOODS' ? (
          <GoodsReceiptNoteItemsTableForm
            enableAddItem={false}
            readOnly={true}
            rowSelectionEnabled={false}
            value={receiptNote.items}
          />
        ) : (
          <ServicesReceiptNoteItemsTableForm
            enableAddItem={false}
            readOnly={true}
            rowSelectionEnabled={false}
            value={receiptNote.items}
          />
        )}
      </fieldset>

      <fieldset style={{ marginBottom: 20 }}>
        <legend>Charges</legend>
        <ChargesItemsTableForm
          enableAddItem={false}
          readOnly={true}
          rowSelectionEnabled={false}
          value={receiptNote.charges}
        />
      </fieldset>

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView receiptNote={receiptNote} /></Col>
        <Col span={8}><br/><DetailedTotalAmountCard {...detailedTotalAmountCardProps} /></Col>
      </Row>

      <br/>

      <DescriptionList size="small" col="2">
        <Description term="Orderd By">{receiptNote.createdBy.fullName}</Description>
        <Description term="Order Date">{moment(receiptNote.createDate).local().format(dateTimeFormat)}</Description>
        <Description term="Received By">{receiptNote.createdBy.fullName}</Description>
        <Description term="Receive Date">{moment(receiptNote.createDate).local().format(dateTimeFormat)}</Description>
        <Description term="Approved By">{receiptNote.createdBy.fullName}</Description>
        <Description term="Approve Date">{moment(receiptNote.createDate).local().format(dateTimeFormat)}</Description>
      </DescriptionList>
    </div>
  );
}

ReceiptNoteView.propTypes = {
  receiptNote: PropTypes.object.isRequired,
};

export default ReceiptNoteView;
