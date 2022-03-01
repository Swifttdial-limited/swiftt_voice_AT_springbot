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
  DatePicker,
  Tooltip
} from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';

import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import FilesView from '../../common/files';
import InventoryAdjustmentItemsTableForm from './InventoryAdjustmentItemsTableForm';
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
    span: 6,
  },
  wrapperCol: {
    span: 18,
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

let inventoryAdjustmentTotal = 0;

const calculateInventoryAdjustmentTotal = (items) => {
  inventoryAdjustmentTotal = 0;

  items.forEach((inventoryAdjustmentItem) => {
    let lineTotal = 0;

    lineTotal = (inventoryAdjustmentItem.adjustmentQuantity * inventoryAdjustmentItem.inventoryMetadata.cost);

    inventoryAdjustmentTotal += lineTotal;
  });
}

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    // console.log('onFieldsChange: ', changedFields, allFields);
    if ('items' in changedFields) {
      calculateInventoryAdjustmentTotal(changedFields.items.value);
    }
  },
  onValuesChange(_, changedValues, allValues) {
    // console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      calculateInventoryAdjustmentTotal(changedValues.items);
    }
  },
})
class InventoryAdjustmentForm extends PureComponent {
  static defaultProps = {
    inventoryAdjustment: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    dispatch: PropTypes.func,
    inventoryAdjustment: PropTypes.object,
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
    inventoryAdjustmentTotal = 0;
  }

  componentWillReceiveProps(nextProps) {
    if ('inventoryAdjustment' in nextProps) {
      if (nextProps.inventoryAdjustment.id) {
        calculateInventoryAdjustmentTotal(nextProps.inventoryAdjustment.items);
      }
    }
  }

  locationSelectHandler = (value) => {
    this.props.form.setFieldsValue({ location: value, items: [] });
  }

  render() {
    const {
      onCreate,
      onCreateAndSubmit,
      onSave,
      onSubmit,
      onApprove,
      onReject,
      form,
      inventoryAdjustment,
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
      total: inventoryAdjustmentTotal,
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: inventoryAdjustmentTotal,
    };

    const locationSelectProps = {
      multiSelect: false,
      departmental: true,
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
              title: 'Are you sure you want to create and submit this inventory adjustment?',
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
            title: 'Are you sure you want to submit this inventory adjustment?',
            onOk() {
              onSubmit();
            },
          });
        }
      });
    }

    function handleApprove() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to approve this receipt note?',
            onOk() {
              onApprove(values.items);
            },
          });
        }
      });
    }

    function handleReject() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this receipt note?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('inventoryAdjustmentTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { inventoryAdjustment.id ? (
                  <div>
                    { inventoryAdjustment.inventoryAdjustmentStatus === 'INCOMPLETE' && (
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

                    { inventoryAdjustment.inventoryAdjustmentStatus === 'IN_PROCESS' && (
                    <div>
                      <Button
                        style={{ marginRight: 10 }}
                        loading={loading}
                        htmlType="submit"
                        icon="like"
                        onClick={handleApprove}>Approve</Button>
                      <Button
                        type="danger"
                        loading={loading}
                        htmlType="submit"
                        icon="dislike"
                        onClick={handleReject}>Reject</Button>
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
              <FormItem {...headerFormItemLayout} label="Adjustment Date" hasFeedback>
                {getFieldDecorator('adjustmentDate', {
                  initialValue: inventoryAdjustment.adjustmentDate ? moment(inventoryAdjustment.adjustmentDate, dateFormat) : moment(moment().format(dateFormat), dateFormat),
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'Adjustment Date must be specified',
                    },
                  ],
                })(<DatePicker
                  format={dateFormat}
                  disabledDate={disabledDate}
                />)}
              </FormItem>
              <FormItem
                label={(
                  <span>
                    Location&nbsp;
                    <Tooltip title="Location being adjusted.">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                  )}
                hasFeedback
                {...headerFormItemLayout}
              >
                {getFieldDecorator('location', {
                  initialValue: inventoryAdjustment.location ? inventoryAdjustment.location : null,
                  rules: [{
                    required: true,
                    message: 'Sending location must be specified',
                  }],
                })(<LocationSelect
                  editValue={inventoryAdjustment.location ? inventoryAdjustment.location : null}
                  onLocationSelect={this.locationSelectHandler}
                  {...locationSelectProps}
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
                  initialValue: inventoryAdjustment.id ? inventoryAdjustment.items : [],
                })(<InventoryAdjustmentItemsTableForm
                    enableAddItem={getFieldValue('location') ? true : false}
                    location={getFieldValue('location') ? getFieldValue('location') : null}
                    rowSelectionEnabled={inventoryAdjustment.inventoryAdjustmentStatus === 'IN_PROCESS' ? true : false} />)}
              </div>
            </Panel>
          </Collapse>

          <br/>

          <Row gutter={24}>
            <Col span={15}>
              {inventoryAdjustment.id && (
                <FilesView
                  readOnly={false}
                  context={inventoryAdjustment.id}
                  contextType="INVENTORY_TRANSFER" />
              )}
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                  initialValue: inventoryAdjustment.comment,
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

export default InventoryAdjustmentForm;
