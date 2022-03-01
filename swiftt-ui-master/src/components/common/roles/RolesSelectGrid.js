import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Button,
  Tooltip,
  Icon,
  Tag,
  LocaleProvider,
  Row,
  Col,
  Table,
  Modal
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import RolesSelectGridModal from './RolesSelectGridModal';

const confirm = Modal.confirm;

class RolesSelectGrid extends PureComponent {

  static defaultProps = {
    roles: [],
    onRoleChange:() => {},
    onRemoveRole:() => {},
    size: 'small',
    title: '',
  };

  static propTypes = {
    roles: PropTypes.array,
    onRoleChange: PropTypes.func.isRequired,
    onRemoveRole: PropTypes.func.isRequired,
    small: PropTypes.string,
    title: PropTypes.string,
  };

  state = {
    isEditActive: false,
    modalVisible: false,
  }

  handleRoleListMenuClick = (record, e) => {
    const { onRemoveRole } = this.props;
    
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        onRemoveRole(record);
      },
    });
  }

  handleModalOk = (value) => {
    const {
      onRoleChange,
    } = this.props;

    this.handleHideModal();

    onRoleChange(value)
  }

  handleHideModal = () => {
    this.setState((previousState, currentProps) => {
      return {
        modalVisible: !previousState.modalVisible
      };
    })
  }

  handleModalShow = () => {
    this.setState((previousState, currentProps) => {
      return {
        modalVisible: !previousState.modalVisible
      };
    })
  }

  onEditDetailsButtonClickHandler = () => {
    this.setState((previousState, currentProps) => {
      return {
        isEditActive: !previousState.isEditActive,
      };
    });
  }

  render() {
    const {
      roles,
      size,
      title
    } = this.props;
    const { isEditActive, modalVisible } = this.state;

    const roleColumns = [
      {
        title: 'Role Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'User Group',
        dataIndex: 'actor.name',
        key: 'actor.name',
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            isEditActive ? <Button type="dashed" shape="circle" icon="delete" onClick={this.handleRoleListMenuClick.bind(null, record)} /> : null
          );
        },
      },
    ];

    const rolesModalProps = {
      visible: modalVisible,
    };

    const RolesSelectGridModalGen = () => <RolesSelectGridModal
      onOk={this.handleModalOk}
      onCancel={this.handleHideModal}
      {...rolesModalProps} />;

    return (
      <fieldset>
        <legend style={{ marginBottom: 0 }}>
          <Row>
            <Col span={18}>{title}</Col>
            <Col span={6}>
              {!isEditActive ? (
                <Row>
                  <Col style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Tooltip title="Edit details">
                      <Button type="dashed" icon="edit" onClick={this.onEditDetailsButtonClickHandler}>Edit</Button>
                    </Tooltip>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Button type="primary" onClick={this.handleModalShow} icon="plus">Assign New Role</Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </legend>
        <Table
          pagination={false}
          rowKey={record => record.id}
          dataSource={roles}
          columns={roleColumns}
          size={size}
          style={{ marginBottom: '20px' }}
        />
        <RolesSelectGridModalGen  />
      </fieldset>
    );
  }

}

export default RolesSelectGrid;
