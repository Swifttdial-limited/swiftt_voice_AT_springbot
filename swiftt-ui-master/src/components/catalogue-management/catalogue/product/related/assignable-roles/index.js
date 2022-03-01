import PropTypes from 'prop-types';
import React from 'react';
import {Row, Col, Table, Button, Icon, Modal} from 'antd';

const confirm = Modal.confirm;

function AssignableRolesView({
                               loading,
                               product,
                               onAssignableRoleAdd,
                               onAssignableRoleRemove,
                             }) {
  function handleAssignableRoleMenuClick(record, e) {
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        onAssignableRoleRemove(record.publicId);
      },
    });
  }

  const assignableRoleColums = [
    {
      title: 'Role',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Department',
      dataIndex: 'department.name',
      key: 'department.name',
    }, {
      title: '',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <Button type="dashed" shape="circle" icon="delete"
                  onClick={handleAssignableRoleMenuClick.bind(null, record)}/>
        );
      },
    },
  ];

  const assignableRolesToolbar = (
    <Row gutter={24}>
      <Col lg={12} md={12} sm={16} xs={24}>
        <p>Assignable Roles</p>
      </Col>
      <Col lg={{offset: 4, span: 8}} md={12} sm={8} xs={24} style={{textAlign: 'right'}}>
        <Button type="primary" onClick={onAssignableRoleAdd}><Icon type="plus"/>New Assignable Roles</Button>
      </Col>
    </Row>
  );

  return (
    <div>
      <Table
        title={() => assignableRolesToolbar}
        pagination={false}
        loading={loading}
        rowKey={record => record.id}
        dataSource={product.assignableRoles}
        columns={assignableRoleColums}
        size="middle"
        style={{marginBottom: '10px'}}
      />
    </div>
  );
}

AssignableRolesView.propTypes = {
  loading: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
};

export default AssignableRolesView;
