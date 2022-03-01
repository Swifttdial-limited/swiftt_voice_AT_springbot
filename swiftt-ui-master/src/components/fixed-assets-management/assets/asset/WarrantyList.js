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

function WarrantyListView({ loading,  asset, onWarrantyAdd, onWarrantyRemove }) {

  function handleWarrantyMenuClick(record, e) {
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        onWarrantyRemove(record.id);
      },
    });
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'warrantyNumber',
      key: 'warrantyNumber',
    },{
      title: 'Firm',
      dataIndex: 'warrantyFirm',
      key: 'warrantyFirm',
    },
    {
      title: 'Contacts',
      dataIndex:   "warrantyFirmContacts",
      key:   "warrantyFirmContacts"
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
          <Button type="dashed" shape="circle" icon="delete" onClick={handleWarrantyMenuClick.bind(null, record)} />
        );
      },
    },
  ];


  const warrantyToolbar = (
    <Row gutter={24}>
      <Col style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={onWarrantyAdd} icon="plus">Add Warranty</Button>
      </Col>
    </Row>
  );

  return (
    <div>
      <LocaleProvider locale={enUS}>
        <Table
          title={() => warrantyToolbar}
          pagination={false}
          loading={loading}
          //rowKey={record => record.id}
          dataSource={asset.assetWarranties}
          columns={columns}
          size="small"
        />
      </LocaleProvider>
    </div>
  );
}

WarrantyListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  asset: PropTypes.object.isRequired,
};

export default WarrantyListView;
