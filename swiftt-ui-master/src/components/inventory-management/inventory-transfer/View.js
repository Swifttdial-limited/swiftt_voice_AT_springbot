import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Card, Table, Button, Row, Col } from 'antd';

import DescriptionList from '../../DescriptionList';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import FilesView from '../../common/files';
import InventoryTransferItemsTableForm from './InventoryTransferItemsTableForm';
import RelatedView from './related/Related';
import TotalAmountCard from '../../common/TotalAmountCard';

const { Description } = DescriptionList;

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;

function InventoryTransferView({
  inventoryTransfer,
}) {

  let inventoryTransferTotal = 0;

  inventoryTransfer.items.forEach((inventoryTransferItem) => {
    let lineTotal = 0;

    lineTotal = (inventoryTransferItem.expectedQuantity * inventoryTransferItem.cost);
    inventoryTransferTotal += lineTotal;
  });

  const detailedTotalAmountCardProps = {
    total: inventoryTransferTotal,
  };

  const totalAmountCardProps = {
    description: 'Total',
    amount: inventoryTransferTotal,
  };

  return (
    <div>
      <InventoryTransferItemsTableForm
        enableAddItem={false}
        readOnly={true}
        rowSelectionEnabled={false}
        value={inventoryTransfer.items} />

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView inventoryTransfer={inventoryTransfer} /></Col>
        <Col span={8}><br/><DetailedTotalAmountCard {...detailedTotalAmountCardProps} /></Col>
      </Row>

      <br/>

      <DescriptionList size="small" col="2">
        <Description term="Orderd By">{inventoryTransfer.createdBy.fullName}</Description>
        <Description term="Order Date">{moment(inventoryTransfer.createDate).local().format(dateTimeFormat)}</Description>
        <Description term="Received By">{inventoryTransfer.createdBy.fullName}</Description>
        <Description term="Receive Date">{moment(inventoryTransfer.createDate).local().format(dateTimeFormat)}</Description>
        <Description term="Approved By">{inventoryTransfer.createdBy.fullName}</Description>
        <Description term="Approve Date">{moment(inventoryTransfer.createDate).local().format(dateTimeFormat)}</Description>
      </DescriptionList>

    </div>
  );
}

InventoryTransferView.propTypes = {
  inventoryTransfer: PropTypes.object.isRequired,
};

export default InventoryTransferView;
