import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  LocaleProvider,
  Card,
  Form,
  Input,
  Button,
  Icon,
  Collapse,
  Modal,
  message,
  DatePicker,
  Tooltip
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import FilesView from '../../common/files';
import InventoryTransferItemsTableForm from './InventoryTransferItemsTableForm';
import LocationSelect from '../../common/LocationSelect';
import TotalAmountCard from '../../common/TotalAmountCard';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 14,
  },
};

const headerFormItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;

let inventoryTransferTotal = 0;

const calculateInventoryTransferTotal = (items) => {
  inventoryTransferTotal = 0;

  items.forEach((inventoryTransferItem) => {
    let lineTotal = 0;

    lineTotal = (inventoryTransferItem.quantity * inventoryTransferItem.cost);

    inventoryTransferTotal += lineTotal;
  });
}

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    // console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues, allValues) {
    // console.log('onValuesChange: ', changedValues, allValues);
  },
})
class InventoryTransferForm extends PureComponent {
  static defaultProps = {
    inventoryTransfer: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    dispatch: PropTypes.func,
    inventoryTransfer: PropTypes.object,
    formType: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    success: PropTypes.bool,
    onCreate: PropTypes.func,
    onCreateAndSubmit: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    onApprove: PropTypes.func,
    onReject: PropTypes.func,
  };

  constructor(props) {
    super(props);
    inventoryTransferTotal = 0;
  }

  componentWillReceiveProps(nextProps) {
    if ('inventoryTransfer' in nextProps) {
      if (nextProps.inventoryTransfer.id) {
        calculateInventoryTransferTotal(nextProps.inventoryTransfer.items);
      }
    }
  }

  fromLocationSelectHandler = (value) => {
    this.props.form.setFieldsValue({ fromLocation: value, items: [] });
  }

  toLocationSelectHandler = value => {
    this.props.form.setFieldsValue({ toLocation: value });
  }

  render() {
    const {
      onCreate,
      onCreateAndSubmit,
      onSave,
      onSubmit,
      onOrderFulfilled,
      onReceived,
      onReject,
      form,
      inventoryTransfer,
      loading,
      success,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldValue,
      validateFields,
      getFieldsValue,
      setFieldsValue
    } = form;

    const detailedTotalAmountCardProps = {
      total: inventoryTransferTotal,
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: inventoryTransferTotal,
    };

    const fromLocationSelectProps = {
      multiSelect: false,
      departmental: true,
    };

    const toLocationSelectProps = {
      multiSelect: false,
      department: getFieldValue('toDepartment') ? getFieldValue('toDepartment').publicId : null,
    };

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); }
      else if (!allowPast && allowFuture) { return current && current.valueOf() < Date.now(); }
    };

    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onCreate(values) } else {}
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) {
            confirm({
              title: 'Are you sure you want to create and submit this inventory transfer?',
              onOk() {
                onCreateAndSubmit(values)
              },
            });
          } else {}
        }
      });
    }

    function handleSave() {
      validateFields((err, values) => {
        if (!err) {
          if (values.items.length > 0) { onSave(values) } else {}
        }
      });
    }

    function handleSubmit() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to submit this inventory transfer?',
            onOk() {
              onSubmit();
            },
          });
        }
      });
    }

    function handleMarkAsSent() {
      validateFields((err, values) => {
        if (!err) {
          const sentItems = values.items.filter(item => item.approved);

          if(sentItems.length > 0) {
            confirm({
              title: 'Are you sure you want to mark this inventory transfter as "Sent"?',
              onOk() {
                onOrderFulfilled(sentItems);
              },
            });
          } else {
            message.warning('At least one item must be selected to be marked as "Sent"');
          }
        }
      });
    }

    function handleMarkAsReceived() {
      validateFields((err, values) => {
        if (!err) {
          const receivedItems = values.items.filter(item => item.approved && item.sentQuantity && item.receivedQuantity);

          if(receivedItems.length > 0) {
            confirm({
              title: 'Are you sure you want to mark this inventory transfer as "Received"?',
              onOk() {
                onReceived(receivedItems);
              },
            });
          } else {
            message.warning('At least one approved item must be selected to be marked as "Received"');
          }
        }
      });
    }

    function handleReject() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this inventory transfer',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('inventoryTransferTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { inventoryTransfer.id ? (
                  <div>
                    { inventoryTransfer.inventoryTransferStatus === 'INCOMPLETE' &&
                      (sessionStorage.getItem('current_user') && JSON.parse(sessionStorage.getItem('current_user')).u_pid === inventoryTransfer.createdBy.publicId) &&
                      (
                    <div>
                      <Button
                        style={{ marginRight: 10 }}
                        loading={loading}
                        type="primary"
                        icon="step-forward"
                        onClick={handleSubmit}>Submit</Button>
                      <Button
                        loading={loading}
                        type="primary"
                        icon="save"
                        onClick={handleSave}>Save Draft</Button>
                    </div>
                    )}

                    { inventoryTransfer.inventoryTransferStatus === 'IN_PROCESS' && (
                    <div>
                      { inventoryTransfer.ordered &&
                        !inventoryTransfer.sent &&
                        sessionStorage.getItem('current_user') &&
                        JSON.parse(sessionStorage.getItem('current_user')).department &&
                        JSON.parse(sessionStorage.getItem('current_user')).department.publicId === inventoryTransfer.fromDepartment.publicId &&
                      <Button style={{ marginRight: 10 }} loading={loading} htmlType="submit" icon="like" onClick={handleMarkAsSent}>Mark as Sent</Button>
                      }
                      { inventoryTransfer.ordered &&
                        inventoryTransfer.sent &&
                        !inventoryTransfer.received &&
                        sessionStorage.getItem('current_user') &&
                        JSON.parse(sessionStorage.getItem('current_user')).department &&
                        JSON.parse(sessionStorage.getItem('current_user')).department.publicId === inventoryTransfer.toDepartment.publicId &&
                      <Button style={{ marginRight: 10 }} loading={loading} htmlType="submit" icon="like" onClick={handleMarkAsReceived}>Mark as Received</Button>
                      }
                      {
                        inventoryTransfer.ordered &&
                        !inventoryTransfer.sent &&
                        sessionStorage.getItem('current_user') &&
                        JSON.parse(sessionStorage.getItem('current_user')).department &&
                        JSON.parse(sessionStorage.getItem('current_user')).department.publicId !== inventoryTransfer.toDepartment.publicId &&
                        <Button type="danger" loading={loading} htmlType="submit" icon="dislike" onClick={handleReject}>Reject</Button>
                      }
                    </div>
                  )}
                  </div>
                ) : (
                  <div>
                    <Button
                      style={{ marginRight: 10 }}
                      loading={loading}
                      htmlType="submit"
                      type="primary"
                      icon="step-forward"
                      onClick={handleCreateAndSubmit}>Submit</Button>
                    <Button
                      loading={loading}
                      type="primary"
                      icon="save"
                      onClick={handleCreate}>Save Draft</Button>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16}>
              <FormItem
                label={(
                  <span>
                    From Location&nbsp;
                    <Tooltip title="Location sending goods">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                  )}
                hasFeedback
                {...headerFormItemLayout}
              >
                {getFieldDecorator('fromLocation', {
                  initialValue: inventoryTransfer.fromLocation ? inventoryTransfer.fromLocation : null,
                  rules: [{
                    required: true,
                    message: 'Sending location must be specified',
                  }],
                })(<LocationSelect
                  editValue={inventoryTransfer.fromLocation ? inventoryTransfer.fromLocation : null}
                  onLocationSelect={this.fromLocationSelectHandler}
                  {...fromLocationSelectProps}
                />
                )}
              </FormItem>
              <FormItem
                label={(
                  <span>
                    To Location&nbsp;
                    <Tooltip title="Location ordering and receiving goods">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                  )}
                hasFeedback
                {...headerFormItemLayout}
              >
                {getFieldDecorator('toLocation', {
                  initialValue: inventoryTransfer.toLocation ? inventoryTransfer.toLocation : null,
                  rules: [{
                    required: true,
                    message: 'Receiving location must be specified',
                  }],
                })(<LocationSelect
                  editValue={inventoryTransfer.toLocation ? inventoryTransfer.toLocation : null}
                  onLocationSelect={this.toLocationSelectHandler}
                  {...toLocationSelectProps}
                />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <TotalAmountCard {...totalAmountCardProps} />
            </Col>
          </Row>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="Items" key="1">
              <div>
                {getFieldDecorator('items', {
                  initialValue: inventoryTransfer.id ? inventoryTransfer.items : [],
                })(<InventoryTransferItemsTableForm
                    fromLocation={getFieldValue('fromLocation') ? getFieldValue('fromLocation') : null}
                    ordered={inventoryTransfer.ordered}
                    sent={inventoryTransfer.sent}
                    rowSelectionEnabled={inventoryTransfer.inventoryTransferStatus === 'IN_PROCESS' ? true : false} />)}
              </div>
            </Panel>
          </Collapse>

          <br/>

          <Row gutter={24}>
            <Col span={15}>
              {inventoryTransfer.id && (
                <FilesView
                  readOnly={false}
                  context={inventoryTransfer.id}
                  contextType="INVENTORY_TRANSFER" />
              )}
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                  initialValue: inventoryTransfer.comment,
                })(<TextArea rows={4} />)}
              </FormItem>
            </Col>
            <Col span={9}>
              <DetailedTotalAmountCard {...detailedTotalAmountCardProps} />
            </Col>
          </Row>
        </Form>
      </LocaleProvider>
    );
  }
}

export default InventoryTransferForm;
