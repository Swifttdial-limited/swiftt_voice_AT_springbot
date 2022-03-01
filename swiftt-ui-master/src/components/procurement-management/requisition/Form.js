import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
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
  message,
  Modal,
  DatePicker,
  Radio,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DepartmentSelect from '../../common/DepartmentSelect';
import FilesView from '../../common/files';
import LocationSelect from '../../common/LocationSelect';
import RequisitionItemsTableForm from './RequisitionItemsTableForm';
import TotalAmountCard from '../../common/TotalAmountCard';
import DetailedTotalAmountCard from '../../common/DetailedTotalAmountCard';

const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Panel } = Collapse;

const dateFormat = 'YYYY-MM-DD';

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

let requisitionTotal = 0;

const calculateRequisition = (items) => {
  requisitionTotal = 0;

  items.forEach((item) => {
    let lineTotal = 0;
    lineTotal = (item.quantity * item.cost);
    requisitionTotal += lineTotal;
  });
}

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    //console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues, allValues) {
    //console.log('onValuesChange: ', changedValues, allValues);
    if ('items' in changedValues) {
      calculateRequisition(changedValues.items ? changedValues.items : []);
    }
  },
})
class RequisitionForm extends PureComponent {
  static defaultProps = {
    requisition: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    requisition: PropTypes.object,
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
    requisitionTotal = 0;
  }

  componentWillReceiveProps(nextProps) {
    if ('requisition' in nextProps) {
      if(nextProps.requisition.id) {
        calculateRequisition(nextProps.requisition.items);
      }
    }
  }

  contactSelectHandler = value => this.props.form.setFieldsValue({ vendor: value });

  render() {
    const {
      onCreate,
      onCreateAndSubmit,
      onSave,
      onSubmit,
      onApprove,
      onReject,
      form,
      requisition,
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
      total: requisitionTotal,
    };

    const futureDisableDates = (current) => {
      return (current && current.valueOf()) > Date.now();
    };

    const pastDisableDates = (current) => {
      return (current && current.valueOf()) + 10000 <= Date.now();
    };

    const totalAmountCardProps = {
      description: 'Total',
      amount: requisitionTotal,
    };

    const sourceLocationSelectProps = {
      multiSelect: false,
      departmental: true,
      onLocationSelect(data) {
        setFieldsValue({ deliverTo : data })
      }
    };

    const toDepartmentSelectProps = {
      multiSelect: false,
      onDepartmentSelect(data) {
        if(data) {
          // TODO does not clear destination location field on destination department change
          if(getFieldValue('dispatchDepartment') && (data.publicId !== getFieldValue('dispatchDepartment').publicId)) {
            setFieldsValue({ dispatchDepartment : null });
            setFieldsValue({ dispatchedFrom: null })
          }

          setFieldsValue({ dispatchDepartment : data });
        } else {
          setFieldsValue({ dispatchedFrom: null })
        }
      }
    };

    const toLocationSelectProps = {
      department: getFieldValue('dispatchDepartment') ? getFieldValue('dispatchDepartment').publicId : null,
      multiSelect: false,
      onLocationSelect(data) {
        setFieldsValue({ dispatchedFrom : data })
      }
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
              title: 'Are you sure you want to create and submit this requisition?',
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
            title: 'Are you sure you want to submit this requisition?',
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
          const approvedItems = values.items.filter(item => item.approved);

          if(approvedItems.length > 0) {
            confirm({
              title: 'Are you sure you want to approve this requisition?',
              onOk() {
                onApprove(approvedItems);
              },
            });
          } else {
            message.warning('At least one item must be selected for approval.');
          }
        }
      });
    }

    function handleReject() {
      validateFields((err, values) => {
        if (!err) {
          confirm({
            title: 'Are you sure you want to reject this requisition?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('requisitionType', { initialValue: 'INTERNAL_REQUISITION' });
    getFieldDecorator('requisitionTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { requisition.id ? (
                  <div>
                    { requisition.requisitionStatus === 'INCOMPLETE' && (
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

                    { requisition.requisitionStatus === 'IN_PROCESS' && (
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
              <FormItem label="Requisition Date" hasFeedback {...headerFormItemLayout}>
                {getFieldDecorator('requestDate', {
                  initialValue: requisition.receiveDate ? moment(requisition.receiveDate, dateFormat) : moment(moment().format(dateFormat), dateFormat),
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'Request date is required',
                    }
                  ]
                })(
                  <DatePicker
                    format={dateFormat}
                    disabledDate={futureDisableDates}
                  />)}
              </FormItem>
              {/*
                <FormItem label="Type of Purchase Order" hasFeedback {...headerFormItemLayout}>
                  {getFieldDecorator('purchaseOrderType', {
                    initialValue: purchaseOrder.purchaseOrderType ? purchaseOrder.purchaseOrderType : 'GOODS',
                    rules: [
                      {
                        required: true,
                        message: 'Type of Purchase Order must be specified',
                      },
                    ],
                  })(
                    <RadioGroup disabled={getFieldValue('items') ? getFieldValue('items').length > 0 : false}>
                      <Radio value="GOODS">Goods</Radio>
                      <Radio value="SERVICE">Services</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem label="Required Date" hasFeedback {...headerFormItemLayout}>
                  {getFieldDecorator('dateRequired', {
                    initialValue: requisition.dateRequired ? moment(requisition.dateRequired, dateFormat) : moment(moment().format(dateFormat), dateFormat),
                  })(
                    <DatePicker
                      format={dateFormat}
                      disabledDate={futureDisableDates}
                    />)}
                </FormItem>
              */}

              {(getFieldValue('requisitionType') === undefined || getFieldValue('requisitionType') === "INTERNAL_REQUISITION") && (
                <Fragment>
                  <FormItem
                    label="Requesting Location"
                    hasFeedback
                    {...headerFormItemLayout}
                  >
                    {getFieldDecorator('deliverTo', {
                      initialValue: requisition.deliverTo ? requisition.deliverTo : null,
                      rules: [{
                        required: true,
                        message: 'Requesting location must be specified',
                      }],
                    })(<LocationSelect
                      editValue={requisition.deliverTo ? requisition.deliverTo : null}
                      {...sourceLocationSelectProps}
                    />
                    )}
                  </FormItem>
                  <FormItem
                    label="Issuing Department"
                    hasFeedback
                    {...headerFormItemLayout}
                  >
                    {getFieldDecorator('dispatchDepartment', {
                      initialValue: requisition.dispatchDepartment ? requisition.dispatchDepartment : null,
                      rules: [{
                        required: true,
                        message: 'Issuing department must be specified',
                      }],
                    })(<DepartmentSelect
                      editValue={requisition.dispatchDepartment ? requisition.dispatchDepartment : null}
                      {...toDepartmentSelectProps}
                    />
                    )}
                  </FormItem>
                  {getFieldValue('dispatchDepartment') && (
                      <FormItem
                        label="Issuing Location"
                        hasFeedback
                        {...headerFormItemLayout}
                      >
                        {getFieldDecorator('dispatchedFrom', {
                          initialValue: requisition.dispatchedFrom ? requisition.dispatchedFrom : null,
                          rules: [{
                            required: true,
                            message: 'Issuing location must be specified',
                          }],
                        })(<LocationSelect
                          editValue={requisition.dispatchedFrom ? requisition.dispatchedFrom : null}
                          {...toLocationSelectProps}
                        />
                      )}
                    </FormItem>
                  )}
                </Fragment>
              )}

            </Col>
            <Col span={8}>
              {/*<TotalAmountCard {...totalAmountCardProps} />*/}
            </Col>
          </Row>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: 10 }}>
            <Panel header="Request Items" key="1">
              <div>
                {getFieldDecorator('items', {
                  initialValue: (requisition.id || (requisition.items)) ? requisition.items : [],
                })(<RequisitionItemsTableForm
                    rowSelectionEnabled={requisition.requisitionStatus === 'IN_PROCESS' ? true : false} />)}
              </div>
            </Panel>
          </Collapse>

          <Row gutter={24} style={{ marginBottom: 10 }}>
            <Col span={15}>
              { requisition.id && (
                <FilesView readOnly={false}
                  context={requisition.id}
                  contextType="REQUISITION" />
              )}
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                    initialValue: requisition.comment,
                 })(<TextArea rows={4} />)}
              </FormItem>
            </Col>
            <Col span={9}>
              {/*<DetailedTotalAmountCard {...detailedTotalAmountCardProps} />*/}              
            </Col>
          </Row>
        </Form>
      </LocaleProvider>
    );
  }
}

export default RequisitionForm;
