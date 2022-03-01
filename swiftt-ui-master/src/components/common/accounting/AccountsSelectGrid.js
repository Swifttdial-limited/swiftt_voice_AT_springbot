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
import { remove, unionBy } from 'lodash';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountsSelectGridModal from './AccountsSelectGridModal';

const confirm = Modal.confirm;

class AccountsSelectGrid extends PureComponent {

  static defaultProps = {
    accounts: [],
    onAccountsChange:() => {},
    title: 'Accounts',
  };

  static propTypes = {
    accounts: PropTypes.array,
    onAccountsChange: PropTypes.func.isRequired,
    title: PropTypes.string,
  };

  state = {
    isEditActive: false,
    modalVisible: false,
  }

  handleAccountListMenuClick = (record, e) => {
    const { accounts, onAccountsChange } = this.props;
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        remove(accounts, (account) => {
          return account.publicId === record.publicId;
        });

        onAccountsChange(accounts);
      },
    });
  }

  handleModalOk = (value) => {
    const {
      accounts,
      onAccountsChange,
    } = this.props;

    this.handleHideModal();

    let newAccounts = [];
    newAccounts = unionBy(accounts, value.accounts, 'publicId');
    onAccountsChange(newAccounts)
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
      accounts,
      title
    } = this.props;
    const { isEditActive, modalVisible } = this.state;

    const accountColumns = [
      {
        title: 'Account Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Account Number',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            isEditActive ? <Button type="dashed" shape="circle" icon="delete" onClick={this.handleAccountListMenuClick.bind(null, record)} /> : null
          );
        },
      },
    ];

    const accountsModalProps = {
      visible: modalVisible,
    };

    const AccountsSelectGridModalGen = () => <AccountsSelectGridModal
      onOk={this.handleModalOk}
      onCancel={this.handleHideModal}
      {...accountsModalProps} />;

    return (
      <fieldset>
        <legend style={{ marginBottom: 0 }}>
          <Row>
            <Col span={18}>{title}</Col>
            <Col span={4}>
              {!isEditActive ? (
                <Row>
                  <Col offset={20} span={4}>
                    <Tooltip title="Edit details">
                      <Button type="dashed" shape="circle" icon="edit" onClick={this.onEditDetailsButtonClickHandler} />
                    </Tooltip>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col offset={20} span={4}>
                    <Button type="primary" onClick={this.handleModalShow} icon="plus" />
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </legend>
        <Table
          pagination={false}
          rowKey={record => record.id}
          dataSource={accounts}
          columns={accountColumns}
          size="middle"
          style={{ marginBottom: '20px' }}
        />
        <AccountsSelectGridModalGen  />
        </fieldset>
    );
  }

}

export default AccountsSelectGrid;
