import React from 'react';
import { func } from 'prop-types';
import { connect } from 'dva';
import { Button, Modal, Row, Col } from 'antd';

import './OrganogramNodeComponent.less';

const confirm = Modal.confirm;

function OrganogramNodeComponent({
  dispatch,
  node,
}) {
  function showNodeModal() {
    dispatch({
      type: 'organogramNodes/showModal',
      payload: {
        modalType: 'createChildNode',
        currentItem: node,
      },
    });
  }

  function deleteNode() {
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        dispatch({ type: 'organogramNodes/delete', payload: node.nodePublicId });
      },
    });
  }

  return (
    <div className="organogramNode">
      <Row gutter={24} style={{ marginBottom: 0 }}>
        <Col span={18} offset={6}>
          <Button type="dashed" shape="circle" icon="plus" onClick={showNodeModal} />
          {/* <Button type="dashed" shape="circle" icon="edit" /> */}
          <Button type="dashed" shape="circle" icon="delete" onClick={deleteNode} />
        </Col>
      </Row>
      <p><strong>Role:</strong> {node.name}</p>
      <p><strong>User Group:</strong> {node.actor.name}</p>

      {node.department ? <p><strong>Department:</strong> {node.department.name}</p> : null }
    </div>
  );
}


export default connect()(OrganogramNodeComponent);
