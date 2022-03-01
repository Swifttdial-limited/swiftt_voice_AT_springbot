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
  Tag,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import { forEach } from 'lodash';

import GoodsReturnReasonSelect from '../../common/GoodsReturnReasonSelect';
import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';

export default class TableForm extends PureComponent {
  static defaultProps = {
    readOnly: false,
    rowSelectionEnabled: false,
  };

  static propTypes = {
    readOnly: PropTypes.bool,
    rowSelectionEnabled: PropTypes.bool,
  };

  state = {
    data: [],
    loading: false,
    isFormActive: false,
    selectedRows: [],
  };

  componentDidMount() {
    if ('value' in this.props) {
      this.setState({
        data: this.props.value ? this.props.value.map((item) => {
          if(item.id)
            item.key = item.id;
          else {
            item.key = item.receiptNoteItemId;
          }
          return item;
        }) : [],
      });
    }
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

      if (!target.product.id || !target.expectedQuantity || !target.receivedQuantity ) {
        message.error('All required fields must be specified');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (!target.product.stockAccount) {
        message.error('Item stock account must be specified');
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

    selectedRows.forEach(selectedRow => {
      data.forEach(item => {
        if(item.id) {
          if (selectedRow.id === item.id) {
            item.approved = true;
          }
        } else {
          if (selectedRow.key === item.key) {
            item.eligible = true;
          }
        }
      });
    });

    this.setState({
      selectedRows,
      data,
    });
  };

  // handleRowSelectChange = (selectedRowKeys, selectedRows) => {
  //   let { needTotalList } = this.state;
  //   needTotalList = needTotalList.map(item => ({
  //     ...item,
  //     total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
  //   }));
  //   const { onSelectRow } = this.props;
  //   if (onSelectRow) {
  //     onSelectRow(selectedRows);
  //   }
  //
  //   this.setState({ selectedRowKeys, needTotalList });
  // };

  render() {
    const { readOnly, rowSelectionEnabled } = this.props;

    const { isFormActive } = this.state;

    const goodsReturnReasonSelectProps = {
      multiSelect: true,
    };

    const columns = [
      {
        title: 'Item',
        dataIndex: 'product.productName',
        key: 'product.productName',
        width: '25%',
        render: (text, record) => {
          return <span>{record.product.productName} ({record.product.productCode})</span>;
        },
      }, {
        title: 'Batch Number',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        width: '10%',
        render: (text, record) => {
          return text ? text : '-';
        },
      }, {
        title: 'Expiry Date',
        dataIndex: 'bestBeforeDate',
        key: 'bestBeforeDate',
        width: '10%',
        render: (text, record) => {
          return text ? moment(text).format(dateFormat) : '-';
        },
      }, {
        title: 'Pack Size',
        dataIndex: 'packSize.packSize',
        key: 'packSize.packSize',
        width: '10%',
        render: (text, record) => {
          if(record.packSize) {
            let packSize = record.packSize.packSize;

            if(record.packSize.unitOfMeasure) {
              packSize = packSize + ' (' + record.packSize.unitOfMeasure.abbreviation + ')';
            }
            return <span>{packSize}</span>;
          }
          return <Input disabled style={{ width: '100%' }} defaultValue={0}/>;
        },
      }, {
        title: 'Cost per pack',
        dataIndex: 'cost',
        key: 'cost',
        width: '8%',
        render: (text, record) => {
          return <span>{numeral(record.cost).format('0,0.00')}</span>;
        },
      }, {
        title: 'Received Qty',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
        align: 'right',
        width: '8%',
        render: (text, record) => {
          return text;
        },
      }, {
        title: 'Return Qty',
        dataIndex: 'returnQuantity',
        key: 'returnQuantity',
        align: 'right',
        width: '8%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={record ? record.returnQuantity : 0}
                min={1}
                max={record.receivedQuantity}
                onChange={value => this.handleFieldChange(value, 'returnQuantity', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return text;
        },
      }, {
        title: 'Reasons',
        dataIndex: 'reasons',
        align: 'center',
        key: 'reasons',
        render: (text, record) => {
          if (record.editable) {
            return (
              <GoodsReturnReasonSelect
                editValue={record.reasons ? record.reasons : null}
                {...goodsReturnReasonSelectProps}
                onGoodsReturnReasonSelect={value => this.handleFieldChange(value, 'reasons', record.key)}/>
            );
          }
          return <span>{record.reasons ? record.reasons.map(reason => <Tag key={reason.id}>{reason.code}</Tag>) : null}</span>
        }
      }, {
        title: '',
        key: 'action',
        align: 'center',
        width: '8%',
        render: (text, record) => {
          if(readOnly) {
            return null;
          }
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            return (
              <span>
                <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveRow(e, record.key)} />
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
          rowSelection={rowSelection}
        />
      </Fragment>
    );
  }
}
