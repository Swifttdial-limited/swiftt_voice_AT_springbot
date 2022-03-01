import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  LocaleProvider,
  Checkbox,
  Row,
  Col,
  Tooltip,
  Icon
} from 'antd';


import enUS from 'antd/lib/locale-provider/en_US';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class modal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }


  handleOk = () => {
    const { form, item, onOk } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };
      onOk(data);
    });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;


    const modalOpts = {
      title: `${type === 'create' ? 'New Maintenance Categories' : 'Edit Maintenance Categories'}`,
      visible,
      width:600,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };


    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Name：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('categoryName', {
                initialValue: item.categoryName,
                rules: [
                  {
                    required: true,
                    message: 'category name must be specified',
                 },
                ],
             })(<Input placeholder="Group name" />)}
            </FormItem>

            {/*<FormItem label="Departments:" hasFeedback {...formItemLayout}>*/}
              {/*{getFieldDecorator('departments', {*/}
                {/*initialValue: item.departments ? item.departments : null,*/}
                {/*rules: [*/}
                  {/*{*/}
                    {/*required: true,*/}
                    {/*message: 'Deparment(s) must be specified',*/}
                 {/*},*/}
                {/*],*/}
             {/*})(<DepartmentSelect {...departmentSelectProps} />)}*/}
            {/*</FormItem>*/}

            {/*<Row style={{ marginBottom: 10 }}>*/}
              {/*<Col span={14} offset={6} >*/}
                {/*<Checkbox onChange={this.onParentGroupToggleHandler}>*/}
                  {/*<span>Is sub-group of? &nbsp;*/}
                    {/*<Tooltip title="Is it a sub-group?">*/}
                      {/*<Icon type="question-circle-o" />*/}
                    {/*</Tooltip>*/}
                  {/*</span>*/}
                {/*</Checkbox>*/}
              {/*</Col>*/}
            {/*</Row>*/}

            {/*{showParentGroupSelect && (*/}
              {/*<FormItem label="Parent Group" hasFeedback {...formItemLayout}>*/}
                  {/*{getFieldDecorator('parentGroup', {*/}
                    {/*rules: [*/}
                      {/*{*/}
                        {/*required: showParentGroupSelect,*/}
                        {/*message: 'Parent Group must be specified',*/}
                     {/*},*/}
                    {/*],*/}
                 {/*})(<GroupSelect {...groupSelectProps} />)}*/}
              {/*</FormItem>*/}
            {/*)}*/}

            <FormItem label="Description：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
             })(<TextArea rows={4} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default modal;
