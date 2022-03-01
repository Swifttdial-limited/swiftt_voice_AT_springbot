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

import StockSelect from '../../common/StockSelect';

import { queryOne } from '../../../services/catalogue/products';
import { querySummarized } from '../../../services/inventory/inventoryBalances';

import styles from './style.less';

export default class TableForm extends PureComponent {
  static defaultProps = {
    readOnly: false,
    rowSelectionEnabled: false,
  };

  static propTypes = {
    ordered: PropTypes.bool,
    sent: PropTypes.bool,
    readOnly: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
  };

  state = {
    data: [],
    loading: false,
    isFormActive: false,
  };

  // should fetch balances when rowSelected is enabled or when location is changed
  componentDidUpdate(prevProps) {
    if (prevProps.fromLocation.publicId != this.props.fromLocation.publicId) {
      console.log('Fe')

      const productIds = this.props.value.map((item) => item.product.id);
      this.fetchInventoryData(productIds);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value && prevState.data.length == 0) {
      return {
        data: nextProps.value ? nextProps.value.map((x) => {
          if(x.id)
            x.key = x.id;

          if(nextProps.ordered && nextProps.sent && x.sentQuantity && !x.receivedQuantity) {
            x.approved = false;
          }

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

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  fetchProduct = (productId) => {
    queryOne({
      id: productId,
    }).then((response) => {
      return response;
    }).catch((e) => {
      message.error('Error fetching item details.');
    });
  }

  fetchInventoryData = (products) => {
    const newData = this.state.data.map(item => ({ ...item }));

    querySummarized({
      location: this.props.fromLocation.publicId,
      product: products,
    }).then((response) => {
      response.content.forEach(item => {
        const target = newData.filter(transferItem => transferItem.product.id === item.productId)[0];
        if(target) {
          target.availableBalance = item.balance;
        }
      });

      this.setState({ data: newData });
    }).catch(() => {
      console.log('Hmmm')
    });
  }

  handleFieldChange(value, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (fieldName === 'product' && value !== undefined) {
        queryOne({
          id: value.id,
        }).then((response) => {
          target[fieldName] = response;

          if (value && response.packSize) {
            target.packSize = response.packSize;
          }

          this.setState({ data: newData });
        }).catch((e) => {
          message.error('Error fetching item details.');
        });
      } else {
        target[fieldName] = value;

        this.setState({ data: newData });
      }
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

      if (!target.product.id || !target.orderedQuantity || !target.product.packSize.packSize) {
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

  // TODO handle multiselect
  handleSelectRows = (record, selected, selectedRows) => {
    const { ordered, sent } = this.props;
    const { data } = this.state;

    data.forEach((item) => {
      if (record.id === item.id) {
        if(selected) {
          if(ordered && !sent && !item.sentQuantity) {
            // TODO fetch to and from balance
           item.sentQuantity = item.orderedQuantity;
          }

          if(ordered && sent && item.sentQuantity && !item.receivedQuantity) {
            item.receivedQuantity = item.sentQuantity;
          }

          item.approved = true;
        } else {
          if(ordered && !sent && item.sentQuantity) {
           item.sentQuantity = 0;
          }

          if(ordered && sent && item.sentQuantity && item.receivedQuantity) {
            item.receivedQuantity = 0;
          }

          item.approved = false;
        }
      }
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
      fromLocation,
      readOnly,
      rowSelectionEnabled,
      ordered,
      sent,
    } = this.props;
    const { isFormActive } = this.state;

    const stockSelectProps = {
      fromLocation: fromLocation || null,
      multiSelect: false,
    };

    const columns = [
      {
        title: 'Item',
        dataIndex: 'product.productName',
        key: 'product.productName',
        width: '20%',
        render: (text, record) => {
          return <span>{record.product.productName} ({record.product.productCode})</span>;
        },
      }, {
        title: 'Units Ordered',
        dataIndex: 'orderedQuantity',
        key: 'orderedQuantity',
        align: 'right',
        width: '15%',
        render: (text, record) => {
          return text;
        },
      }, {
        title: 'Source Balance',
        dataIndex: 'sourceBalance',
        key: 'sourceBalance',
        align: 'right',
        width: '13%',
        render: (text, record) => {
          return <span>{text ? text : 0}</span>;
        },
      }, {
        title: 'Available Balance',
        dataIndex: 'availableBalance',
        key: 'availableBalance',
        align: 'right',
        width: '12%',
        render: (text, record) => {
          return <span>{text ? text : 0}</span>;
        },
      }, {
        title: 'Transfer Quantity',
        dataIndex: 'sentQuantity',
        key: 'sentQuantity',
        align: 'right',
        width: '12%',
        render: (text, record) => {
          if (record.editable && ordered && !sent) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.sentQuantity : 0}
                min={1}
                onChange={value => this.handleFieldChange(value, 'sentQuantity', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return text ? text : 0;
        },
      }, {
        title: 'Received Quantity',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
        align: 'right',
        width: '12%',
        render: (text, record) => {
          if (record.editable && ordered && sent) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.receivedQuantity : 0}
                min={1}
                max={record.sentQuantity}
                onChange={value => this.handleFieldChange(value, 'receivedQuantity', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return text ? text : 0;
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
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
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
            </span>
          );
        },
      },
    ];

    const rowSelection = {
      hideDefaultSelections: true,
      onSelect: this.handleSelectRows,
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
        />
      </Fragment>
    );
  }
}
