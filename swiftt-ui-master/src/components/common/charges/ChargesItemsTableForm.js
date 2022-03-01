import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Divider,
  Icon,
} from 'antd';
import numeral from 'numeral';
import { forEach } from 'lodash';

import ChargeModal from './ChargeModal';
import Ellipsis from '../../Ellipsis';

import styles from './style.less';

export default class TableForm extends PureComponent {
  static defaultProps = {
    allowProcessing: false,
    enableAddItem: true,
    readOnly: false,
    rowSelectionEnabled: false,
  };

  static propTypes = {
    allowProcessing: PropTypes.bool,
    enableAddItem: PropTypes.bool,
    readOnly: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
  };

  state = {
    currentItem: {},
    data: [],
    loading: false,
    isFormActive: false,
    modalType: 'create',
    modalVisible: false,
    selectedRows: [],
  };

  index = 0;
  cacheOriginData = {};

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value ? nextProps.value.map((item) => {
          if(item.id)
            item.key = item.id;
          return item;
        }) : [],
      });
    }
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if(this.props.allowProcessing) {
        if (!target.editable) {
          this.cacheOriginData[key] = { ...target };
        }
        target.editable = !target.editable;
        this.setState({ data: newData, isFormActive: true });
      } else {
        this.setState({ currentItem: target, modalType: 'update', modalVisible: true });
      }
    }
  };

  newChargeItem = () => {
    this.setState({
      modalVisible: true,
      modalType: 'create'
    });
  };

  handleModalOk = (data) => {
    const { modalType } = this.state;
    let newData = [];

    if(modalType === 'create') {
      newData = this.add(data);
    } else if(modalType === 'update') {
      newData = this.update(data);
    }

    this.setState({
      currentItem: {},
      modalType: 'create',
      data: newData,
      isFormActive: false
    }, () => {
      this.props.onChange(this.state.data);
    });
  }

  add = (data) => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      chargeType: data.chargeType,
      amount: data.amount ? data.amount : 0,
      comment: data.comment,
      editable: true,
      isNew: true,
    });
    this.index += 1;

    return newData;
  }

  remove = (key) => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }

  update = (data) => {
    return this.state.data.map(item => {
      if(item.key === data.key) {
        return Object.assign({}, item, data);
      }
      return item;
    });
  }

  handleFieldChange(value, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleModalCancel = () => {
    this.setState({ modalVisible: false });
  }

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    const { data } = this.state;

    selectedRows.forEach((selectedRow) => {
      data.forEach((item) => {
        if (selectedRow.id === item.id) {
          item.approved = true;
        }
      });
    });

    this.setState({
      selectedRows,
      data,
    });
  };

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};

      if (!target.chargeType.publicId || !target.amount) {
        message.error('All required fields must be specified');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }

      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
        isFormActive: false,
      });
    }, 500);
  }

  render() {
    const {
      allowProcessing,
      enableAddItem,
      readOnly,
      rowSelectionEnabled
    } = this.props;

    const {
      currentItem,
      isFormActive,
      modalType,
      modalVisible,
      selectedRows
    } = this.state;

    const chargeItemModalProps = {
      item: currentItem,
      type: modalType,
      visible: modalVisible,
      onOk: this.handleModalOk,
      onCancel: this.handleModalCancel,
    };

    const ChargeModalGen = () => <ChargeModal {...chargeItemModalProps} />;

    const columns = [
      {
        title: 'Type of Charge',
        dataIndex: 'chargeType.name',
        key: 'chargeType.name',
        width: '30%',
        render: (text, record) => {
          return <span>{record.chargeType.name}</span>;
        },
      }, {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
        width: '50%',
        render: (text) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: '10%',
        render: (text, record) => {
          return <span>{numeral(record.amount).format('0,0.00')}</span>;
        },
      }, {
        title: '',
        key: 'action',
        align: 'center',
        render: (text, record) => {
          if(readOnly) {
            return null;
          }
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable && allowProcessing) {
            return (
              <span>
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
              </span>
            );
          }
          return (
            <span>
              <Button type="dashed" shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.key)} />
              {!allowProcessing && (
                <Fragment>
                  <Divider type="vertical" />
                  <Popconfirm title="Delete line？" onConfirm={() => this.remove(record.key)}>
                    <Button type="dashed" icon="delete" />
                  </Popconfirm>
                </Fragment>
              )}
            </span>
          );
        },
      },
    ];

    const rowSelection = {
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: !rowSelectionEnabled, // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <Fragment>
        <Table
          className={styles.table}
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowKey={record => record.key}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
          rowSelection={!readOnly && rowSelection}
          scroll={{ y: 500 }}
        />
        {enableAddItem && (
          <Button
            disabled={isFormActive}
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newChargeItem}
            icon="plus"
          >
            Add Line
          </Button>
        )}
        <ChargeModalGen />
      </Fragment>
    );
  }
}
