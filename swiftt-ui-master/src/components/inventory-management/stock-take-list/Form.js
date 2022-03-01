import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  LocaleProvider,
  Form,
  Input,
  Button,
  Icon,
  Collapse,
  Modal,
  DatePicker,
  Tooltip
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import FilesView from '../../common/files';
import LocationSelect from '../../common/LocationSelect';
import StockTakeItemsTableForm from './StockTakeItemsTableForm';

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

@Form.create({
  onFieldsChange(_, changedFields, allFields) {
    // console.log('onFieldsChange: ', changedFields, allFields);
  },
  onValuesChange(_, changedValues, allValues) {
    // console.log('onValuesChange: ', changedValues, allValues);
  },
})
class StockTakeListForm extends PureComponent {
  static defaultProps = {
    stockTakeList: {},
    formType: 'create',
    loading: false,
  };

  static propTypes = {
    dispatch: PropTypes.func,
    stockTakeList: PropTypes.object,
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

  state = {
    reqTotal: 0,
  };

  locationSelectHandler = value => this.props.form.setFieldsValue({ location: value });

  render() {
    const {
      onCreate,
      onCreateAndSubmit,
      onSave,
      onSubmit,
      onApprove,
      onReject,
      form,
      stockTakeList,
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

    const locationSelectProps = {
      multiSelect: false,
      style: {
        width: '300px',
      },
    };

    const stockTakeItemsTableFormProps = {
      enableAddItem: getFieldValue('location') ? true : false,
      location: getFieldValue('location') ? getFieldValue('location') : null,
      rowSelectionEnabled: stockTakeList.status === 'IN_PROCESS' ? true : false,
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
              title: 'Are you sure you want to create and submit this stock take list?',
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
            title: 'Are you sure you want to submit this stock take list?',
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
            title: 'Are you sure you want to approve this stock take list?',
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
            title: 'Are you sure you want to reject this stock take list?',
            onOk() {
              onReject();
            },
          });
        }
      });
    }

    getFieldDecorator('stockTakeListTotal', { initialValue: 0 });

    return (
      <LocaleProvider locale={enUS}>
        <Form>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
              <FormItem {...tailFormItemLayout}>
                { stockTakeList.id ? (
                  <div>
                    { stockTakeList.status === 'INCOMPLETE' && (
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

                    { stockTakeList.status === 'IN_PROCESS' && (
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
          <FormItem
            label={(
              <span>
                Location&nbsp;
                <Tooltip title="Location where stock items are being counted">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
              )}
            hasFeedback
            {...headerFormItemLayout}
          >
            {getFieldDecorator('location', {
              initialValue: stockTakeList.location ? stockTakeList.location : null,
              rules: [{
                required: true,
                message: 'Receiving location must be specified',
              }],
            })(<LocationSelect
              editValue={stockTakeList.location ? stockTakeList.location : null}
              onLocationSelect={this.locationSelectHandler}
              {...locationSelectProps}
            />
            )}
          </FormItem>
          <FormItem {...headerFormItemLayout} label="Stock Taking Date" hasFeedback>
            {getFieldDecorator('stockTakingDate', {
              initialValue: stockTakeList.stockTakingDate ? moment(stockTakeList.stockTakingDate, dateFormat) : moment(moment().format(dateFormat), dateFormat),
              rules: [
                {
                    type: 'object',
                    required: true,
                    message: 'Stock Taking Date must be specified',
                },
              ],
            })(<DatePicker
                format={dateFormat}
                disabledDate={disabledDate} />)}
          </FormItem>

          <hr />

          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="Items" key="1">
            <div>
              {getFieldDecorator('items', {
                initialValue: stockTakeList.id ? stockTakeList.items : [],
              })(<StockTakeItemsTableForm {...stockTakeItemsTableFormProps} />)}
            </div>
            </Panel>
          </Collapse>

          <br/>

          <Row gutter={24}>
            <Col span={15}>
              {stockTakeList.id && (
                <FilesView
                  readOnly={false}
                  context={stockTakeList.id}
                  contextType="STOCKTAKE_LIST" />
              )}
              <FormItem label="Comment：" hasFeedback>
                {getFieldDecorator('comment', {
                    initialValue: stockTakeList.comment,
                 })(<TextArea rows={4} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </LocaleProvider>
    );
  }
}

export default StockTakeListForm;
