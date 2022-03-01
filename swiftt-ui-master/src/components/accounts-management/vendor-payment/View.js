import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Button, Row, Col } from 'antd';

import DescriptionList from '../../DescriptionList';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import RelatedView from './related/Related';
import VendorBillItemsTableForm from './VendorBillItemsTableForm';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function VendorPaymentView({
  vendorPayment,
}) {
  let vendorPaymentTotal = 0;

  vendorPayment.bills
    .filter(item => item.approved || item.approvedAmount)
    .forEach((item) => {
    vendorPaymentTotal += item.approvedAmount;
  });

  const detailedTotalAmountCardProps = {
    total: vendorPaymentTotal,
  };

  const totalAmountCardProps = {
    description: 'Total',
    amount: vendorPaymentTotal,
  };

  return (
    <div>
      <VendorBillItemsTableForm
        readOnly={true}
        rowSelectionEnabled={false}
        status={vendorPayment.vendorPaymentStatus}
        value={vendorPayment.bills}
      />

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView vendorPayment={vendorPayment} /></Col>
        <Col span={8}><br/><DetailedTotalAmountCard {...detailedTotalAmountCardProps} /></Col>
      </Row>

      <br/>

      <DescriptionList csize="small" col="3">
        <Description term="Created By">{vendorPayment.createdBy.fullName}</Description>
        <Description term="Created At">{moment(vendorPayment.createdDate).format(dateTimeFormat)}</Description>
      </DescriptionList>
    </div>
  );
}

VendorPaymentView.propTypes = {
  vendorPayment: PropTypes.object.isRequired,
};

export default VendorPaymentView;
