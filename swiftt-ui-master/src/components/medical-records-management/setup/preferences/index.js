import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Input, Select, LocaleProvider, Tooltip, Icon } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DiagnosisVersionSelect from '../../../common/DiagnosisVersionSelect';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect(({ standardsPreferences }) => ({
  standardsPreferences
}))
class StandardsPreferencesView extends PureComponent {

  static propTypes = {
    standardsPreferences: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'standardsPreferences/query' });
  }

  activeDiagnosisVersionSelectHandler = value => this.props.form.setFieldsValue({ activeDiagnosisVersion: value });

  handleFormUpdateSubmit = (e) => {
   e.preventDefault();
  }

  hasErrors = (fieldsError) => {
   return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

 render() {
   const { dispatch, form, standardsPreferences } = this.props;
   const { getFieldDecorator, getFieldsError, validateFields, getFieldsValue, setFieldsValue } = form;
   const { loading, list } = standardsPreferences;

   const formItemLayout = {
     labelCol: {
       span: 6,
     },
     wrapperCol: {
       span: 14,
     },
   };

   const tailFormItemLayout = {
     wrapperCol: {
       xs: { span: 24, offset: 0 },
       sm: { span: 14, offset: 6 },
     },
   };

   const formItems = (
     <div>
       <FormItem
         label={(
           <span>
              Active Diagnosis Code Version&nbsp;
             <Tooltip title="ICD 9 deprecated 2016 or ICD 10">
               <Icon type="question-circle-o" />
             </Tooltip>
           </span>
          )}
         hasFeedback
         {...formItemLayout}
       >
         {getFieldDecorator('activeDiagnosisVersion', {
            initialValue: list.length > 0 ? list[0].activeDiagnosisVersion : null,
            rules: [
              {
                required: true,
                message: 'Active diagnosis codes version must be specified',
             },
            ],
         })(
           <DiagnosisVersionSelect onChange={this.activeDiagnosisVersionSelectHandler} />)}
       </FormItem>
     </div>
   );

   return (
     <LocaleProvider locale={enUS}>
       <div className="content-inner">
         <Form layout="horizontal" onSubmit={this.handleFormUpdateSubmit}>
           {formItems}
         </Form>
       </div>
     </LocaleProvider>
   );
 }
}

export default StandardsPreferencesView;
