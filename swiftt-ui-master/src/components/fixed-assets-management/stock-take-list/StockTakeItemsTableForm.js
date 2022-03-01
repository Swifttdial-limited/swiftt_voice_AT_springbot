import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  InputNumber,
  message,
  Popconfirm,
  Divider,
  Icon
} from 'antd';
import numeral from 'numeral';
import { forEach } from 'lodash';

import BinLocationSelect from '../../common/BinLocationSelect';
import ProductSelect from '../../common/FixedAssetSelect';

import styles from './style.less';

export default class TableForm extends PureComponent {
  static defaultProps = {
    allowProcessing: false,
    readOnly: false,
  };

  static propTypes = {
    allowProcessing: PropTypes.bool,
    readOnly: PropTypes.bool,
    location: PropTypes.object
  };

  state = {
    data: [],
    loading: false,
    isFormActive: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value && prevState.data.length == 0) {
      return {
        data: nextProps.value ? nextProps.value.map((x) => {
          if(x.id)
            x.key = x.id;

          return x;
        }) : [],
      }
    }

    return null;
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

  index = 0;
  cacheOriginData = {};

  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData, isFormActive: true });
    }
  };

  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }

  newStockTakeListItem = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      product: {},
      cost: 0,
      count: 0,
      binLocation: null,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData, isFormActive: true });
  };

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(value, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

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
      if (!target.product.id || !target.count) {
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

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
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

  render() {
    const {
      allowProcessing,
      enableAddItem,
      location,
      readOnly,
      rowSelectionEnabled
    } = this.props;
    const { isFormActive } = this.state;

    const binLocationSelectProps = {
      disabled: location !== undefined ? false : true,
      location,
      multiSelect: false,
    };

    const productSelectProps = {
      multiSelect: false,
      //productTypes: ['MEDICATION', 'SUPPLIES'],
    };

    const columns = [
      {
        title: 'Item',
        dataIndex: 'product.assetName',
        key: 'product.assetName',
        width: '25%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <ProductSelect
                editValue={record ? record.product.assetName : null}
                {...productSelectProps}
                onProductSelect={value => this.handleFieldChange(value, 'product', record.key)}
              />
            );
          }
          return <span>{record.product.assetName} ({record.product.assetCode})</span>;
        },
      }, {
        title: 'Bin Location',
        dataIndex: 'binLocation.name',
        key: 'binLocation.name',
        width: '25%',
        render: (text, record) => {
          return text;
        },
      }, {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
        width: '10%',
        align: 'right',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.count : 0}
                min={1}
                onChange={value => this.handleFieldChange(value, 'count', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return text;
        },
      }, {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        width: '10%',
        align: 'right',
        render: (text) => {
          return <span>{numeral(text ? text : 0).format('0,0')}</span>;
        },
      }, {
        title: 'Variance',
        dataIndex: 'variance',
        key: 'variance',
        width: '10%',
        align: 'right',
        render: (text) => {
          return <span>{numeral(text ? text : 0).format('0,0')}</span>;
        },
      }, {
        title: '',
        key: 'action',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          if(readOnly) {
            return null;
          }
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
                  <Divider type="vertical" />
                  <Popconfirm title="Delete line?" onConfirm={() => this.remove(record.key)}>
                    <Button type="dashed" icon="delete" />
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
                <Divider type="vertical" />
                <Button type="dashed" shape="circle" icon="delete" onClick={e => this.cancel(e, record.key)} />
              </span>
            );
          }
          return (
            <span>
              <Button type="dashed" shape="circle" icon="edit" onClick={e => this.toggleEditable(e, record.key)} />
              <Divider type="vertical" />
              <Popconfirm title="Delete line？" onConfirm={() => this.remove(record.key)}>
                <Button type="dashed" icon="delete" />
              </Popconfirm>
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
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
          rowSelection={!readOnly && rowSelection}
        />
        {enableAddItem && (
          <Button
            disabled={isFormActive}
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newStockTakeListItem}
            icon="plus"
          >
            Add Line
          </Button>
        )}

      </Fragment>
    );
  }
}
