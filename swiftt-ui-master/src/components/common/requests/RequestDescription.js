import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Tag } from 'antd';

import DescriptionList from '../../DescriptionList';
import styles from './RequestDescription.less';

const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';

function RequestDescription ({
  request
}) {
  const renderRequestStatusTag = () => {
    switch (request.status) {
      case 'NEW':
        return <Tag color="magenta">NEW</Tag>;
      case 'ACTIVE':
        return <Tag color="green">IN PROGRESS</Tag>;
      case 'CANCELLED':
        return <Tag color="red">CANCELLED</Tag>;
      case 'COMPLETED':
        return <Tag color="magenta">COMPLETED</Tag>;
      case 'AWAITING_CONFIRMATION':
        return <Tag color="purple">AWAITING CONFIRMATION</Tag>;
      case 'PENDING_BILL_PAYMENT':
        return <Tag color="purple">PENDING BILL PAYMENT</Tag>;
      default:
        return <Tag color="blue">{status}</Tag>;
    }
  };

  return(
    <DescriptionList className={styles.headerList} size="small">
      <Description term="From">{request.sourceDepartment ? request.sourceDepartment.name : 'Not specified'}</Description>
      <Description term="Requested By">{request.createdBy.fullName}</Description>
      <Description term="Requested At">{moment(request.creationDate).format(dateFormat)}</Description>
      <Description term="Assigned To">{request.assignedUser ? request.assignedUser.fullName : 'Not assigned'}</Description>
      <Description term="Status">{renderRequestStatusTag()}</Description>
      <Description term="Triage Category">{request.visit.triageCategory ? request.visit.triageCategory.name : 'Not Specified'}</Description>
    </DescriptionList>
  );
}

export default RequestDescription;
