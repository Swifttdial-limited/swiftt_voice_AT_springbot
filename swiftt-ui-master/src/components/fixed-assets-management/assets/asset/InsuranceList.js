import PropTypes from 'prop-types';
import React from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Icon,
  Modal,
  LocaleProvider
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from "moment";

const confirm = Modal.confirm;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function InsuranceListView({ loading,  asset, onInsuranceAdd, onInsuranceRemove }) {

  function handleInsuranceMenuClick(record, e) {
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        onInsuranceRemove(record.id);
      },
    });
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'policyNumber',
      key: 'policyNumber',
    },{
      title: 'Firm',
      dataIndex: 'insuranceFirm',
      key: 'insuranceFirm',
    },
    {
      title: 'Contacts',
      dataIndex:   "insuranceAgent",
      key:   "insuranceAgent"
    },
    {
      title: 'Start Date',
      dataIndex:"startDate" ,
      key:"startDate" ,
      render: text => <span>{moment(text).local().format(dateFormat)}</span>,
    },
    {
      title: 'End Date',
      dataIndex:"endDate",
      key:"endDate",
      render: text => <span>{moment(text).local().format(dateFormat)}</span>,
    } ,
    {
      title: 'Status',
      dataIndex:"active" ,
      key:"active" ,
      render: (text, record) => {
        return (
          "active"
        );
      },
    },{
      title: '',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <Button type="dashed" shape="circle" icon="delete" onClick={handleInsuranceMenuClick.bind(null, record)} />
        );
      },
    },
  ];


  const InsuranceToolbar = (
    <Row gutter={24}>
      <Col style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={onInsuranceAdd} icon="plus">Add Insurance</Button>
      </Col>
    </Row>
  );

  return (
    <div>
      <LocaleProvider locale={enUS}>
        <Table
          title={() => InsuranceToolbar}
          pagination={false}
          loading={loading}
          //rowKey={record => record.id}
          dataSource={asset.assetInsurances}
          columns={columns}
          size="small"
        />
      </LocaleProvider>
    </div>
  );
}

InsuranceListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  asset: PropTypes.object.isRequired,
};

export default InsuranceListView;
