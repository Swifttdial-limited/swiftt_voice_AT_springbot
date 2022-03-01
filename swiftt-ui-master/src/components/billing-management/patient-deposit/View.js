import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Tag,
} from 'antd';

import RelatedView from './related/Related';

import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function PatientDepositView({
  loading,
  deposit,
}) {
  const renderPatientDepositRequestStatusTag = (status) => {
    switch (status) {
      case 'PAID':
        return <Tag color="grey">Paid</Tag>;
      case 'UNPAID':
        return <Tag color="blue">Not Paid</Tag>;
      case 'CANCELLED':
        return <Tag color="purple">Cancelled</Tag>;
      default:
        return <Tag color="blue">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Deposit Request No',
      dataIndex: 'depositRequestNumber',
      key: 'depositRequestNumber',
      width: '15%',
      align: 'center',
      render: (text) => {
        return <span>{text}</span>;
      },
    }, {
      title: 'Requesting Department',
      dataIndex: 'department',
      key: 'department',
      width: '15%',
      render: (text, record) => {
        return <span>{record.department.name}</span>;
      },
    }, {
      title: 'Type of Deposit',
      dataIndex: 'depositDefinition',
      key: 'depositDefinition.name',
      width: '15%',
      render: (text, record) => {
        return <span>{record.depositDefinition.name}</span>;
      },
    }, {
      title: 'Request By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: '9%',
      render: (text, record) => {
        return <span>{record.createdBy.fullName}</span>;
      },
    }, {
      title: 'Request Date',
      dataIndex: 'creationDate',
      key: 'creationDate',
      width: '9%',
      align: 'center',
      render: text => <span>{text ? moment(text).local().format(dateFormat) : null}</span>,
    }, {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '12%',
      render: (text) => {
        return <span>{renderPatientDepositRequestStatusTag(text)}</span>;
      },
    }, {
      title: 'Deposit Amount',
      dataIndex: 'depositDefinition',
      key: 'depositDefinition.requiredDepositAmount',
      align: 'right',
      width: '10%',
      render: (text, record) => {
        return <span>{numeral(record.depositDefinition.requiredDepositAmount).format('0,0.00')}</span>;
      },
    },
  ];

  return (
    <div>
      <fieldset>
        <legend>Deposit Requests</legend>
        <Table
          className={styles.table}
          loading={loading}
          columns={columns}
          dataSource={deposit.depositRequests}
          pagination={false}
          rowKey={record => record.id}
        />
      </fieldset>
      
      <br />

      <Row gutter={24}>
        <Col><RelatedView deposit={deposit} /></Col>
      </Row>
    </div>
  );
}

PatientDepositView.propTypes = {
  deposit: PropTypes.object.isRequired,
};

export default PatientDepositView;
