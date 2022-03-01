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
  Select,
} from 'antd';
import numeral from 'numeral';
import { forEach } from 'lodash';

import PriceListItemSelect from '../../PriceListItemSelect';

import { query as pricesQuery } from '../../../../services/catalogue/prices';

import styles from './style.less';

export default class TableForm extends PureComponent {
  static defaultProps = {};

  static propTypes = {
    destinationDepartment: PropTypes.object,
    visitType: PropTypes.object,
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
  }

  toggleAssociatedEditable = (e, parentKey, childKey) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const parent = this.getRowByKey(parentKey, newData);

    if (parent) {
      const target = this.getRowByKey(childKey, parent.associatedItems);
      if (target) {
        // 进入编辑状态时保存原始数据
        if (!target.editable) {
          this.cacheOriginData[key] = { ...target };
        }
        target.editable = !target.editable;
        this.setState({ data: newData, isFormActive: true });
      }
    }
  }

  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }

  newRequestItem = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      destinationDepartment: this.props.destinationDepartment,
      priceListItem: {},
      quantity: 1,
      description: null,
      description: '',
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

  fetchDestinationDepartmentFromProductGroups = (departments, id) => {
    return departments.find(department => department.publicId === id);
  }

  handleAssociatedItemFieldChange(value, fieldName, parentKey, childKey) {
    const newData = this.state.data.map(item => ({ ...item }));
    const parent = this.getRowByKey(parentKey, newData);
    if (parent) {
      const target = this.getRowByKey(childKey, parent.associatedItems);

      if (target) {
        if ( fieldName !== 'destinationDepartment') {
          target[fieldName] = value;
        } else if (fieldName === 'destinationDepartment') {
          target[fieldName] = this.fetchDestinationDepartmentFromProductGroups(target.priceListItem.product.group.departments, value);
        }

        this.setState({ data: newData });
      }
    }
  }

  priceListItemSelectHandler = (priceListItem, key) => {
    pricesQuery({
      billingDepartment: this.props.destinationDepartment.publicId,
      parentProduct: priceListItem.product.id,
      priceList: priceListItem.priceList.id,
      visitType: this.props.visitType.id,
      activated: true,
      size: 1000,
    }).then((response) => {
        if (response.content.length > 0) {
          const newData = this.state.data.map(item => ({ ...item }));
          const target = this.getRowByKey(key, newData);

          if (target) {
            target['associatedItems'] = response.content.map((priceListItem, index) => (
              {
                key: `NEW_TEMP_ID_${index}`,
                destinationDepartment: this.props.destinationDepartment,
                priceListItem: priceListItem,
                quantity: 1,
                description: null,
                description: '',
                editable: true,
                isNew: true,
              }
            ));
            this.setState({ data: newData });
          }

          if (!this.state.isAssociatedItemsSectionVisible) {
            this.setState({ isAssociatedItemsSectionVisible: true });
          }
        }

        this.setState({ isAddProductButtonDisabled: false });
      }).catch((error) => {
        // handle error if associatedItems response is an error
      });
  }

  saveAssociatedRow = (e, parentKey, childKey) => {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const newData = this.state.data.map(item => ({ ...item }));
      const parent = this.getRowByKey(parentKey, newData);

      if (parent) {
        const target = this.getRowByKey(childKey, parent.associatedItems);

        if (target) {
          if (!target.destinationDepartment.publicId || !target.quantity) {
            message.error('All required fields must be specified');

            e.target.focus();
            this.setState({
              loading: false,
            });
            return;
          }

          delete target.isNew;
          this.toggleAssociatedEditable(e, parentKey, childKey);
          this.props.onChange(this.state.data);
          this.setState({
            loading: false,
            isFormActive: false,
          });
        }
      } else {
        return;
      }
    }, 500);
  }

  saveRow = (e, key) => {
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

      if (!target.priceListItem.id || !target.quantity) {
        message.error('All required fields must be specified');

        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }

      this.priceListItemSelectHandler(target.priceListItem, key);

      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
        isFormActive: false,
      });
    }, 500);
  }

  cancel = (e, key) => {
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

  render() {
    const { readOnly } = this.props;

    const { isFormActive } = this.state;

    const contactSelectProps = {
      multiSelect: false,
      contactType: 'VENDOR',
    };

    const productSelectProps = {
      activated: true,
      autoLoad: false,
      multiSelect: false,
      productTypes: ['MEDICATION', 'SUPPLIES'],
    };

    const columns = [
      {
        title: 'Item',
        dataIndex: 'priceListItem.product.productName',
        key: 'priceListItem.product.productName',
        width: '30%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <PriceListItemSelect
                onPriceListItemSelect={value => this.handleFieldChange(value, 'priceListItem', record.key)}
              />
            );
          }
          return <span>{record.priceListItem.product.productName} ({record.priceListItem.product.productCode})</span>;
        },
      }, {
        title: 'Price',
        dataIndex: 'priceListItem.sellingPrice',
        key: 'priceListItem.sellingPrice',
        align: 'right',
        width: '12.5%',
        render: (text, record) => {
          return <span>{numeral(text ? text : 0).format('0,0.00')}</span>;
        },
      }, {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '12.5%',
        align: 'right',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                style={{ width: '100%' }}
                defaultValue={1}
                min={1}
                onChange={value => this.handleFieldChange(value, 'quantity', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return <span>{text}</span>;
        },
      }, {
        title: 'Instructions',
        dataIndex: 'description',
        key: 'description',
        width: '34%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                placeholder="Instructions"
                onChange={e => this.handleFieldChange(e.target.value, 'description', record.key)} />
            );
          }
          return <span>{text}</span>;
        },
      }, {
        title: '',
        key: 'action',
        align: 'center',
        width: '16%',
        render: (text, record) => {
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
              <Popconfirm title="Delete line?" onConfirm={() => this.remove(record.key)}>
                <Button type="dashed" icon="delete" />
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const expandedRowRender = (parentRequestItem) => {
      const columns = [
        {
          title: 'Associated Item',
          dataIndex: 'priceListItem.product.productName',
          key: 'priceListItem.product.productName',
          width: '30%',
          render: (text, record) => {
            return <span>{record.priceListItem.product.productName} ({record.priceListItem.product.productCode})</span>;
          }
        }, {
          title: 'Price',
          dataIndex: 'priceListItem.sellingPrice',
          key: 'priceListItem.sellingPrice',
          align: 'right',
          width: '12.5%',
          render: (text, record) => {
            return <span>{numeral(text ? text : 0).format('0,0.00')}</span>;
          },
        }, {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
          width: '12.5%',
          align: 'right',
          render: (text, record) => {
            if (record.editable) {
              return (
                <InputNumber
                  style={{ width: '100%' }}
                  defaultValue={1}
                  min={1}
                  onChange={value => this.handleAssociatedItemFieldChange(value, 'quantity', parentRequestItem.key, record.key)}
                />
              );
            }
            return <span>{text}</span>;
          },
        }, {
          title: 'Department',
          dataIndex: 'destinationDepartment',
          key: 'destinationDepartment',
          width: '34%',
          render: (text, record) => {
            if (record.editable && record.priceListItem.product.group.departments && record.priceListItem.product.group.departments.length > 1) {
              return (
                <Select
                  placeholder="Select department"
                  onChange={value => this.handleAssociatedItemFieldChange(value, 'destinationDepartment', parentRequestItem.key, record.key)}>
                  {record.priceListItem.product.group.departments.map((department, index) => {
                    return <Select.Option value={department.publicId} key={index}>{department.name}</Select.Option>
                  })}
                </Select>
              );
            }
            if(record.priceListItem.product.group.departments && record.priceListItem.product.group.departments.length === 1) {
              return <span>{record.priceListItem.product.group.departments[0].name}</span>;
            }
            return <span>{record.destinationDepartment.name}</span>;
          },
        }, {
          title: '',
          key: 'action',
          align: 'center',
          width: '16%',
          render: (text, record) => {
            if (!!record.editable && this.state.loading) {
              return null;
            }
            if (record.editable) {
              if (record.isNew) {
                return (
                  <span>
                    <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveAssociatedRow(e, parentRequestItem.key, record.key)} />
                    <Divider type="vertical" />
                    <Popconfirm title="Delete line?" onConfirm={() => this.removeAssociated(record.key)}>
                      <Button type="dashed" icon="delete" />
                    </Popconfirm>
                  </span>
                );
              }
              return (
                <span>
                  <Button type="dashed" shape="circle" icon="save" onClick={e => this.saveAssociatedRow(e, record.key)} />
                  <Divider type="vertical" />
                  <Button type="dashed" shape="circle" icon="delete" onClick={e => this.cancel(e, record.key)} />
                </span>
              );
            }
            return (
              <span>
                <Popconfirm title="Delete line?" onConfirm={() => this.removeAssociated(record.key)}>
                  <Button type="dashed" icon="delete" />
                </Popconfirm>
              </span>
            );
          },
        },
      ];

      return (
        <Table
          className={styles.table}
          columns={columns}
          dataSource={parentRequestItem.associatedItems}
          pagination={false}
          size="small"
        />
      );
    };

    return (
      <Fragment>
        <Table
          className={styles.table}
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          defaultExpandAllRows={true}
          expandedRowRender={expandedRowRender}
          pagination={false}
          rowKey={record => record.key}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
          size="small"
        />
        {!readOnly && (
          <Button
            disabled={isFormActive}
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newRequestItem}
            icon="plus"
          >
            Add Line
          </Button>
        )}
      </Fragment>
    );
  }
}
