import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Checkbox, Input, Modal, LocaleProvider, Tooltip, Icon, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../common/AccountSelect';
import DepartmentSelect from '../../../common/DepartmentSelect';
import LocationSelect from '../../../common/LocationSelect';
import LocationTypeSelect from '../../../common/LocationTypeSelect';
import CustomTimeRangeInput from '../../../common/CustomTimeRangeInput';

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

class LocationFormModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    showTimeRangeSelect: false,
    showParentLocationSelect: false
  };

  onSubLocationLocationSelectToggleHandler = (e) => {
    e.target.checked ?
      this.setState({ showParentLocationSelect: true })
      :
      this.setState({ showParentLocationSelect: false });
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
        key: item.key,
      };
      onOk(data);
    });
  }

  showTimeRangeSelectChangeHandler = e => (e.target.checked ? this.setState({ showTimeRangeSelect: false }) : this.setState({ showTimeRangeSelect: true }));

 validateOperatingTime = (rule, value, callback) => {
   if ('startTime' in value && 'endTime' in value) {
     callback();
     return;
   }
   callback('Start Time and End Time must be specified');
 }

 render() {
   const { form, visible, type, item, onOk, onCancel } = this.props;
   const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

   const { showParentLocationSelect, showTimeRangeSelect } = this.state;

   const modalOpts = {
     title: `${type === 'create' ? 'New Location' : 'Edit Location'}`,
     visible,
     onOk: this.handleOk,
     onCancel,
     width: 640,
     wrapClassName: 'vertical-center-modal',
   };

   const accountSelectProps = {
     multiSelect: false,
     onAccountSelect(value) {
       setFieldsValue({ stockAccount: value });
     }
   };

   const departmentSelectProps = {
     multiSelect: false,
     onDepartmentSelect(value) {
       setFieldsValue({ department: value });
     },
   };

   const locationSelectProps = {
     onLocationSelect(value) {
       setFieldsValue({ parentLocation: value });
     },
   };

   const locationTypeSelectProps = {
     multiSelect: true,
     onLocationTypeSelect(value) {
       setFieldsValue({ locationTypes: value });
     },
   };

   return (
     <LocaleProvider locale={enUS}>
       <Modal {...modalOpts}>
         <Form layout="horizontal">
           <FormItem label="Name：" hasFeedback {...formItemLayout}>
             {getFieldDecorator('name', {
                initialValue: item.name,
                rules: [
                  {
                    required: true,
                    message: 'Location name must be specified',
                 },
                ],
             })(<Input />)}
           </FormItem>
           <FormItem label="Location Types：" hasFeedback {...formItemLayout}>
             {getFieldDecorator('locationTypes', {
               initialValue: item.locationTypes ? item.locationTypes : null,
              rules: [
                {
                  required: true,
                  message: 'Location types must be specified',
               },
              ],
             })(<LocationTypeSelect
                  editValue={item.locationTypes ? item.locationTypes : null}
                  {...locationTypeSelectProps} />)}
           </FormItem>

           { (item.id == undefined || item.id !== undefined) && (
             <Row style={{ marginBottom: 10 }}>
               <Col span={14} offset={6}>
                 <Checkbox
                   defaultChecked={item.parentLocation !== undefined ? true : false}
                   onChange={this.onSubLocationLocationSelectToggleHandler}>Is sub-location of</Checkbox>
               </Col>
             </Row>
           )}

           { (showParentLocationSelect || (item.parentLocation !== undefined)) && (
           <FormItem label="Parent Location：" hasFeedback {...formItemLayout}>
             {getFieldDecorator('parentLocation', {
               initialValue: item.parentLocation ? item.parentLocation : null,
                rules: [
                  {
                    required: false,
                    message: 'Parent Location must be specified',
                 },
                ],
               })(<LocationSelect
                    editValue={item.parentLocation ? item.parentLocation : null}
                    {...locationSelectProps} />)}
           </FormItem>
)}
           <FormItem label="Department：" hasFeedback {...formItemLayout}>
             {getFieldDecorator('department', {
               initialValue: item.department ? item.department : null,
             })(<DepartmentSelect
                  editValue={item.department ? item.department.name : null}
                  {...departmentSelectProps} />)}
           </FormItem>
           <FormItem label="Description：" hasFeedback {...formItemLayout}>
             {getFieldDecorator('description', {
               initialValue: item.description ? item.description : null,
             })(<TextArea rows={4} />)}
           </FormItem>
           <Row>
             <Col span={6} />
             <Col span={14}>
               <Checkbox checked={!showTimeRangeSelect} onChange={this.showTimeRangeSelectChangeHandler}>Operates all day?</Checkbox>
             </Col>
           </Row>
           { showTimeRangeSelect && (
           <FormItem label="Operating Time：" hasFeedback {...formItemLayout}>
             {getFieldDecorator('operatingTime', {
                  initialValue: { startTime: '00:00', endTime: '00:00' },
                  rules: [{
                    type: 'object',
                    required: showTimeRangeSelect,
                    message: 'Operating time must be specified',
                    validators: this.validateOperatingTime }],
                })(
                  <CustomTimeRangeInput />
                )}
           </FormItem>
         )}
         <FormItem label="Stock Expense Account：" hasFeedback {...formItemLayout} style={{ marginTop: 10 }}>
           {getFieldDecorator('stockAccount', {
             initialValue: item.stockAccount ? item.stockAccount : null,
              rules: [
                {
                  required: false,
                  message: 'Stock expense account must be specified',
               },
              ],
            })(<AccountSelect
                editValue={item.stockAccount ? item.stockAccount : null}
                {...accountSelectProps} />)}
         </FormItem>
         </Form>
       </Modal>
     </LocaleProvider>
   );
 }
}

export default Form.create()(LocationFormModal);
