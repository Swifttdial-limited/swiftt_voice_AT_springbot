import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Button, Row, Col } from 'antd';

import DescriptionList from '../../DescriptionList';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import RequisitionItemsTableForm from './RequisitionItemsTableForm';
import RelatedView from './related/Related';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function RequisitionView({
  onGeneratePurchaseOrderOk,
  requisition,
}) {
  let requisitionTotal = 0;

  if (requisition.items.length) {
    requisition.items.forEach((item) => {
      let lineTotal = 0;
      lineTotal = (item.quantity * item.cost);
      requisitionTotal += lineTotal;
    });
  }

  function handleGenerateGoodsReceiptNote() {
    onGeneratePurchaseOrderOk({ id: requisition.id });
  }

  const detailedTotalAmountCardProps = {
    total: requisitionTotal,
  };

  return (
    <div>
      <RequisitionItemsTableForm
        readOnly={true}
        rowSelectionEnabled={false}
        value={requisition.items}
      />

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView requisition={requisition} /></Col>
        <Col span={8}><br/>{/*<DetailedTotalAmountCard {...detailedTotalAmountCardProps} />*/}</Col>
      </Row>

      <br />

      <DescriptionList size="small" col="2">
        <Description term="Raised By">{requisition.requestedBy.fullName}</Description>
        <Description term="Raise Date">{moment(requisition.requestDate).local().format(dateTimeFormat)}</Description>
        <Description term="Approved By">{requisition.requestedBy.fullName}</Description>
        <Description term="Approve Date">{moment(requisition.requestDate).local().format(dateTimeFormat)}</Description>
      </DescriptionList>
    </div>
  );
}

RequisitionView.propTypes = {
  onGeneratePurchaseOrderOk: PropTypes.func,
  requisition: PropTypes.object.isRequired,
};

export default RequisitionView;
