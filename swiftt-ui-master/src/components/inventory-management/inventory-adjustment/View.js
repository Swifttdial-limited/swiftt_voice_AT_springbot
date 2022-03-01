import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Card, Table, Button, Row, Col } from 'antd';

import DescriptionList from '../../DescriptionList';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import FilesView from '../../common/files';
import InventoryAdjustmentItemsTableForm from './InventoryAdjustmentItemsTableForm';
import RelatedView from './related/Related';
import TotalAmountCard from '../../common/TotalAmountCard';

const { Description } = DescriptionList;

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;

function InventoryAdjustmentView({
  inventoryAdjustment,
}) {

  let inventoryAdjustmentTotal = 0;

  inventoryAdjustment.items.forEach((inventoryAdjustmentItem) => {
    let lineTotal = 0;

    lineTotal = (inventoryAdjustmentItem.expectedQuantity * inventoryAdjustmentItem.cost);
    inventoryAdjustmentTotal += lineTotal;
  });

  const detailedTotalAmountCardProps = {
    total: inventoryAdjustmentTotal,
  };

  const totalAmountCardProps = {
    description: 'Total',
    amount: inventoryAdjustmentTotal,
  };

  return (
    <div>
      <InventoryAdjustmentItemsTableForm
        enableAddItem={false}
        readOnly={true}
        rowSelectionEnabled={false}
        value={inventoryAdjustment.items} />

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView inventoryAdjustment={inventoryAdjustment} /></Col>
        <Col span={8}><br/><DetailedTotalAmountCard {...detailedTotalAmountCardProps} /></Col>
      </Row>

      <br/>

      <DescriptionList size="small" col="2">
        <Description term="Orderd By">{inventoryAdjustment.createdBy.fullName}</Description>
        <Description term="Order Date">{moment(inventoryAdjustment.createDate).local().format(dateTimeFormat)}</Description>
        <Description term="Received By">{inventoryAdjustment.createdBy.fullName}</Description>
        <Description term="Receive Date">{moment(inventoryAdjustment.createDate).local().format(dateTimeFormat)}</Description>
        <Description term="Approved By">{inventoryAdjustment.createdBy.fullName}</Description>
        <Description term="Approve Date">{moment(inventoryAdjustment.createDate).local().format(dateTimeFormat)}</Description>
      </DescriptionList>

    </div>
  );
}

InventoryAdjustmentView.propTypes = {
  inventoryAdjustment: PropTypes.object.isRequired,
};

export default InventoryAdjustmentView;
