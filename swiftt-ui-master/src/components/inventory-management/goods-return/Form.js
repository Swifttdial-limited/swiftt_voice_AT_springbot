import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import compact from 'lodash/compact';
import moment from 'moment';
import {
  Row,
  Col,
  LocaleProvider,
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Icon,
  Collapse,
  Modal,
  DatePicker,
  message,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';
import FilesView from '../../common/files';
import GoodsReturnItemsTableForm from './GoodsReturnItemsTableForm';
import TotalAmountCard from '../../common/TotalAmountCard';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;

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

let goodsReturnTotal = 0;

const calculateGoodsReturnTotal = (items) => {
  goodsReturnTotal = 0;

  items.forEach((goodsReturnItem) => {
    goodsReturnTotal += (goodsReturnItem.returnQuantity * goodsReturnItem.cost);
  });
}

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    //console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues, allValues) {
    //console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      //calculateGoodsReturnTotal(changedValues.items);
    }
  },
})
class GoodsReturnForm extends PureComponent {
  static defaultProps = {
    goodsReturn: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    goodsReturn: PropTypes.object,
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
    goodsReturnTotal = 0;
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
      goodsReturn,
      loading,
      success
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
      total: goodsReturnTotal,
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: goodsReturnTotal,
    };

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); }
      else if (!allowPast && allowFuture) {
        return current && current.valueOf() > Date.now();
      }
    };

    function handleCreate() {
      validateFields((err, values) => {
        if (!err) {
          const eligibleItems = values.items
          .filter(item => item.eligible)
          .filter(item => item.returnQuantity && item.returnQuantity > 0)
          .filter(item => item.reasons && item.reasons.length > 0);

          console.log(eligibleItems)

          if(eligibleItems.length > 0) {
            values.items = eligibleItems;

            onCreate(values)
          } else {
            message.warning('At least one item with a return reason must be selected');
          }
        }
      });
    }

    function handleCreateAndSubmit() {
      validateFields((err, values) => {
        if (!err) {
          const eligibleItems = values.items
            .filter(item => item.eligible)
            .filter(item => item.returnQuantity && item.returnQuantity > 0)
            .filter(item => item.reasons && item.reasons.length > 0);

            console.log(eligibleItems)

            if(eligibleItems.length > 0) {
              values.items = eligibleItems;

              onCreateAndSubmit(values)
            } else {
              message.warning('At least one item with a return reason must be selected');
            }
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
            title: 'Are you sure you want to submit this goods return?',
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
            title: 'Are you sure you want to approve this goods return?',
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
            title: 'Are you sure you want to reject this goods return?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('receiptNote', { initialValue: goodsReturn.receiptNote ? goodsReturn.receiptNote : null });
    getFieldDecorator('location', { initialValue: goodsReturn.location ? goodsReturn.location : null });
    getFieldDecorator('vendor', { initialValue: goodsReturn.vendor ? goodsReturn.vendor : null });
    getFieldDecorator('goodsReturnTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { goodsReturn.id ? (
                  <div>
                    { goodsReturn.goodsReturnStatus === 'INCOMPLETE' && (
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

                    { goodsReturn.goodsReturnStatus === 'IN_PROCESS' && (
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
                        onClick={handleCreate}>Create</Button>
                    </div>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16}>
              <FormItem label="Receipt No:" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('receiptNoteNumber', {
                  initialValue: goodsReturn.receiptNote ? goodsReturn.receiptNote.receiptNoteNumber : null,
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Vendor" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('vendorName', {
                  initialValue: goodsReturn.vendor ? goodsReturn.vendor.name : null,
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Location" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('locationName', {
                  initialValue: goodsReturn.location ? goodsReturn.location.name : null,
                })(<Input disabled />)}
              </FormItem>
              {/*
                <FormItem label="Description:" hasFeedback {...headerFormItemLayout}>
                  {getFieldDecorator('description', {
                    initialValue: goodsReturn.description ? goodsReturn.description : null,
                    rules: [
                      {
                        required: true,
                        message: 'Description must be specified',
                      },
                    ],
                   })(<Input />)}
                </FormItem>
              */}
              <FormItem {...headerFormItemLayout} label="Return Date" hasFeedback>
                {getFieldDecorator('returnDate', {
                  initialValue: goodsReturn.returnDate ? moment(goodsReturn.returnDate, dateFormat) : moment(moment().format(dateFormat), dateFormat),
                  rules: [
                    {
                        type: 'object',
                        required: true,
                        message: 'Return Date must be specified',
                    },
                  ],
                })(<DatePicker
                    format={dateFormat}
                    disabledDate={disabledDate} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <TotalAmountCard {...totalAmountCardProps} />
            </Col>
          </Row>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
            <Panel header="Items" key="1">
              <div>
                {getFieldDecorator('items', {
                  initialValue: (goodsReturn.id || goodsReturn.items) ? goodsReturn.items : [],
                })(<GoodsReturnItemsTableForm
                    rowSelectionEnabled={goodsReturn.goodsReturnStatus === 'IN_PROCESS' || !goodsReturn.id ? true : false} />)}
              </div>
            </Panel>
          </Collapse>

          <Row gutter={24}>
            <Col span={15}>
              { goodsReturn.id && (
                <FilesView
                  readOnly={false}
                  context={goodsReturn.id}
                  contextType="GOODS_RETURN" />
              )}
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                    initialValue: goodsReturn.comment,
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

export default GoodsReturnForm;
