import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
  Form,
  Checkbox,
  Input,
  Button,
  Tooltip,
  Icon,
  LocaleProvider,
  Row,
  Col,
  Card
} from 'antd';
import pathToRegexp from 'path-to-regexp';
import enUS from 'antd/lib/locale-provider/en_US';

import DepartmentSelect from '../../../components/common/DepartmentSelect';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

@Form.create()
@connect(({ departments }) => ({
  departments
}))
class DepartmentForm extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = { isBillingDepartment: false, showParentDepartmentSelect: false };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'departments/purgeCurrentItem' });
  }

  onIsBillingDepartmentToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ billingAllowed: e.target.checked });
    this.setState({ isBillingDepartment: e.target.checked });
  }

  // onIsBillCreationAllowedToggleHandler = (e) => {
  //   const { form } = this.props;
  //   const { setFieldsValue } = form;
  //
  //   setFieldsValue({ billCreationAllowed: e.target.checked });
  // }

  onIsInvoicingDepartmentToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ invoicingDepartment: e.target.checked });
  }

 onIsMerchantDepartmentToggleHandler = (e) => {
   const { form } = this.props;
   const { setFieldsValue } = form;

   setFieldsValue({ merchantDepartment: e.target.checked });
 }

  onIsWardToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ ward: e.target.checked });
  }

  onParentDepartmentToggleHandler = (e) => {
    e.target.checked ?
      this.setState({ showParentDepartmentSelect: true })
      :
      this.setState({ showParentDepartmentSelect: false });
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/system-administration/departments'));
  }

  handleSubmitAndNew = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSubmit();
        form.resetFields();
      } else {}
    });
  }

  handleSubmitAndClose = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSubmit();
        dispatch(routerRedux.push('/system-administration/departments'));
      } else {}
    });
  }

  handleSubmit = () => {
    const { dispatch, departments, form } = this.props;
    const { currentItem } = departments;

    form.validateFields((err, values) => {
      if (!err) {
        if (currentItem.publicId === undefined) {
          dispatch({ type: 'departments/create', payload: values });
        } else {
          dispatch({ type: 'departments/update', payload: Object.assign({}, currentItem, values) });
        }
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object
      .keys(fieldsError)
      .some(field => fieldsError[field]);
  }

  render() {
    const { form, type, departments } = this.props;
    const { currentItem: item } = departments;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue, getFieldValue, getFieldsError } = form;

    const { isBillingDepartment, showParentDepartmentSelect } = this.state;

    const departmentSelectProps = {
      multiSelect: false,
      onDepartmentSelect(value) {
        setFieldsValue({ parentDepartment: value });
      },
    };

    return (
      <PageHeaderLayout
        title={item.publicId ? 'Edit Department' : 'New Department'}
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Card>
            <LocaleProvider locale={enUS}>
            <Form layout="horizontal">
              <FormItem label="Name：" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [
                    {
                      required: true,
                      message: 'Department name must be specified',
                   },
                  ],
               })(<Input />)}
              </FormItem>
              <FormItem
                label={(
                  <span>
                  Code&nbsp;
                    <Tooltip title="Department code appears as a prefix on 'Over The Counter' OTC generated numbers">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                )}
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('code', {
                  initialValue: item.code,
               })(<Input />)}
              </FormItem>
              <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                {getFieldDecorator('ward', {
                  valuePropName: 'checked',
                  initialValue: item.ward,
               })(
                 <Checkbox onChange={this.onIsWardToggleHandler}>
                   <span>Is a ward?</span>
                 </Checkbox>)
               }
              </FormItem>
              <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                {getFieldDecorator('billingAllowed', {
                    valuePropName: 'checked',
                    initialValue: item.billingAllowed,
                 })(
                 <Checkbox onChange={this.onIsBillingDepartmentToggleHandler}>
                   <span>Is a billing department / point? &nbsp;
                     <Tooltip title="Can it be used to do transactions e.g. Billing">
                       <Icon type="question-circle-o" />
                     </Tooltip>
                   </span>
                 </Checkbox>)
               }
              </FormItem>
              {/*
                <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                  {getFieldDecorator('billCreationAllowed', {
                      valuePropName: 'checked',
                      initialValue: item.billCreationAllowed ? item.billCreationAllowed : false,
                   })(
                   <Checkbox disabled={!isBillingDepartment} onChange={this.onIsBillCreationAllowedToggleHandler}>
                     <span>Is allowed to generate its own bills? &nbsp;
                       <Tooltip title="Can it generate bills for payment?">
                         <Icon type="question-circle-o" />
                       </Tooltip>
                     </span>
                   </Checkbox>)
                 }
                </FormItem>
              */}

              <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                {getFieldDecorator('merchantDepartment', {
                    valuePropName: 'checked',
                    initialValue: item.merchantDepartment ? item.merchantDepartment : false,
                 })(
                 <Checkbox disabled={!isBillingDepartment} onChange={this.onIsMerchantDepartmentToggleHandler}>
                   <span>Is a Merchant / Over-the-counter billing department / point? &nbsp;
                     <Tooltip title="Can it be used to do Merchant / Over-the-counter transactions?">
                       <Icon type="question-circle-o" />
                     </Tooltip>
                   </span>
                 </Checkbox>)
               }
              </FormItem>
              <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                {getFieldDecorator('invoicingDepartment', {
                    valuePropName: 'checked',
                    initialValue: item.invoicingDepartment ? item.invoicingDepartment : false,
                 })(
                 <Checkbox disabled={!isBillingDepartment} onChange={this.onIsInvoicingDepartmentToggleHandler}>
                   <span>Can this department generate its own departmental invoice(s) during billing? &nbsp;
                     <Tooltip title="Can it generate it own departmental invoice(s)?">
                       <Icon type="question-circle-o" />
                     </Tooltip>
                   </span>
                 </Checkbox>)
               }
              </FormItem>
              <Row>
                <Col span={6} />
                <Col span={14}>
                  <Checkbox onChange={this.onParentDepartmentToggleHandler}>Is sub-department of</Checkbox>
                </Col>
              </Row>
              {showParentDepartmentSelect && (
              <FormItem label="Parent Department：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('parentDepartment', {
                    rules: [
                      {
                        required: false,
                        message: 'Parent Department must be specified',
                     },
                    ],
                 })(<DepartmentSelect {...departmentSelectProps} />)}
              </FormItem>
              )}
              <div style={{ marginTop: 10 }}>
                <FormItem {...noLabelTailFormItemLayout}>
                  <Button
                    type="primary"
                    icon="save"
                    onClick={this.handleSubmitAndClose}
                    disabled={this.hasErrors(getFieldsError())}
                    style={{ marginRight: 10 }}
                  >Save &amp; Close
                  </Button>
                  {item.publicId == null
                    && (<Button
                        type="primary"
                        icon="save"
                        onClick={this.handleSubmitAndNew}
                        disabled={this.hasErrors(getFieldsError())}
                      >Save &amp; New
                      </Button>)}
                    <Button
                      type="danger"
                      icon="close"
                      onClick={this.handleCancel}
                      style={{ marginLeft: 50 }}
                    >Cancel
                    </Button>
                </FormItem>
              </div>
            </Form>
            </LocaleProvider>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default DepartmentForm;
