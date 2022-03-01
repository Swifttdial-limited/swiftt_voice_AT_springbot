import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Button, Row, Col } from 'antd';

import CustomerPaymentItemsTableForm from './CustomerPaymentItemsTableForm';
import DescriptionList from '../../DescriptionList';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import RelatedView from './related/Related';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function CustomerPaymentView({
  customerPayment,
}) {
  let customerPaymentTotal = 0;

  customerPayment.items
    .filter(item => item.approved || item.paidAmount)
    .forEach((item) => {
    const lineTotal = item.paidAmount;
    customerPaymentTotal += lineTotal;
  });

  const detailedTotalAmountCardProps = {
    total: customerPaymentTotal,
  };

  const totalAmountCardProps = {
    description: 'Total',
    amount: customerPaymentTotal,
  };

  return (
    <div>
      <CustomerPaymentItemsTableForm
        readOnly={true}
        rowSelectionEnabled={false}
        value={customerPayment.items}
      />

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView customerPayment={customerPayment} /></Col>
        <Col span={8}><br/><DetailedTotalAmountCard {...detailedTotalAmountCardProps} /></Col>
      </Row>

      <br/>

      <DescriptionList csize="small" col="3">
        <Description term="Created By">{customerPayment.createdBy.fullName}</Description>
        <Description term="Created At">{moment(customerPayment.createdDate).format(dateTimeFormat)}</Description>
      </DescriptionList>
    </div>
  );
}

CustomerPaymentView.propTypes = {
  customerPayment: PropTypes.object.isRequired,
};

export default CustomerPaymentView;
