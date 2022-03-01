import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'dva/router';
import moment from 'moment';

import { Card, Table, Icon, Modal, Button } from 'antd';

const dateFormat = 'YYYY-MM-DD';
const columns = [{
  title: 'Name',
  dataIndex: 'user.fullName',
  key: 'user.fullName',
}, {
  title: 'Date of Birth',
  dataIndex: 'user.dateOfBirth',
  key: 'user.dateOfBirth',
  render: text => <span>{moment(text).format(dateFormat)}</span>,
}, {
  title: 'Sex',
  dataIndex: 'user.gender',
  key: 'user.gender',
}, {
  title: 'Marital Status',
  dataIndex: 'user.maritalStatus',
  key: 'user.maritalStatus',
}, {
  title: 'Phone Number',
  dataIndex: 'user.phoneNumber',
  key: 'user.phoneNumber',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <Link to={`accounts-management/contacts/view/${record.publicId}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>
  ),
}];

function DuplicateContactList({ contacts, visible }) {
  function handleOk() {}

  function handleCancel() {}

  return (
    <Modal
      visible={visible}
      title="Found duplicate records"
      width="920"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>Return</Button>,
      ]}
    >
      <Table columns={columns} dataSource={contacts.list} />
    </Modal>
  );
}

DuplicateContactList.propTypes = {
  contacts: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default DuplicateContactList;
