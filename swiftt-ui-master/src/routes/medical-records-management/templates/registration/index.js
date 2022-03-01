import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
  Row,
  Col,
  LocaleProvider,
  Card,
  Form,
  Input,
  InputNumber,
  Radio,
  Button,
  Tooltip,
  Icon,
  Select,
  Alert
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import CustomEditor from '../../../../components/common/CustomEditor';
import DatasheetDesignerDesigner from '../../../../components/common/datasheet/designer';
import FormDesigner from '../../../../components/common/form-designer';
import ProductSelect from '../../../../components/common/ProductSelect';
import RoleSelect from '../../../../components/common/RoleSelect';
import SpecimenSelect from '../../../../components/common/SpecimenSelect';
import UnitOfMeasureSelect from '../../../../components/common/UnitOfMeasureSelect';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 20,
    offset: 4,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
@connect()
class TemplateForm extends PureComponent {

  state = {
    isDepartmentTemplateSectionVisible: false,
    isNonReferencedRangeFormSectionVisible: false,
    isReferencedRangeFormSectionVisible: false,
    isTemplateFormSectionVisible: false,
    isNarrativeTypeFormSectionVisible: false,
    isNarrativeFormItemRequired: false,
    isStandardTypeFormSectionVisible: false,
    isContentTypeFormItemVisible: false,
    isFormDesignSectionVisible: false,
    isDatasheetDesignerSectionVisible: false,
    isAuthorRolesSectionVisible: false,
  };

  defaultTemplateNameHander = () => this.props.form.setFieldsValue({ name: this.props.form.getFieldValue('product') ? `${this.props.form.getFieldValue('product').productName} - ` : '' })

  contentTypeChangeHandler = (e) => {
    if (e.target.value === 'NARRATIVE') {
      this.setState({ isDatasheetDesignerSectionVisible: false, isNarrativeTypeFormSectionVisible: true, isStandardTypeFormSectionVisible: false, isFormDesignSectionVisible: false });
    } else if (e.target.value === 'STANDARD') {
      this.setState({ isDatasheetDesignerSectionVisible: false, isNarrativeTypeFormSectionVisible: false, isStandardTypeFormSectionVisible: true, isFormDesignSectionVisible: false });
    } else if (e.target.value === 'FORM') {
      this.setState({ isDatasheetDesignerSectionVisible: false, isNarrativeTypeFormSectionVisible: false, isStandardTypeFormSectionVisible: false, isFormDesignSectionVisible: true, });
    } else if (e.target.value === 'TABLE') {
      this.setState({ isDatasheetDesignerSectionVisible: true, isNarrativeTypeFormSectionVisible: false, isStandardTypeFormSectionVisible: false, isFormDesignSectionVisible: false, });
    }
  }

  contentChangeHandler = value => this.props.form.setFieldsValue({ content: value });

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/medical-records/templates'));
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
        dispatch(routerRedux.push('/medical-records/templates'));
      } else {}
    });
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'templates/create', payload: values });
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object
      .keys(fieldsError)
      .some(field => fieldsError[field]);
  }

  productSelectHandler = (value) => {
    this.props.form.setFieldsValue({ product: value });
  }

  rangeTypeChangeHandler = (e) => {
    if (e.target.value === 'REFERENCED') {
      this.setState({
        isReferencedRangeFormSectionVisible: true,
        isNonReferencedRangeFormSectionVisible: false
      });
    } else if (e.target.value === 'NON_REFERENCED') {
      this.setState({
        isNonReferencedRangeFormSectionVisible: true,
        isReferencedRangeFormSectionVisible: false
      });
    }
  }

  specimenSelectHandler = value => this.props.form.setFieldsValue({ specimen: value });

  templateTypeChangeHandler = (e) => {
    if (e.target.value === 'DEPARTMENTAL') {
      this.setState({
        isNarrativeTypeFormSectionVisible: false,
        isStandardTypeFormSectionVisible: false,
        isDepartmentTemplateSectionVisible: true
      });
    } else if (e.target.value === 'MEDICAL') {
      this.setState({
        isNarrativeTypeFormSectionVisible: true,
        isNarrativeFormItemRequired: true,
        isStandardTypeFormSectionVisible: false,
        isDepartmentTemplateSectionVisible: false,
        isAuthorRolesSectionVisible: true,
      });
    }
    this.setState({ isTemplateFormSectionVisible: true });
  }

  unitOfMeasureSelectHandler = value => this.props.form.setFieldsValue({ unitOfMeasure: value });

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldsValue, validateFields, setFieldsValue } = form;

    const {
      isDepartmentTemplateSectionVisible,
      isNonReferencedRangeFormSectionVisible,
      isReferencedRangeFormSectionVisible,
      isTemplateFormSectionVisible,
      isNarrativeTypeFormSectionVisible,
      isNarrativeFormItemRequired,
      isStandardTypeFormSectionVisible,
      isContentTypeFormItemVisible,
      isFormDesignSectionVisible,
      isDatasheetDesignerSectionVisible,
      isAuthorRolesSectionVisible,
    } = this.state;

    const productSelectProps = {
      multiSelect: false,
    };

    const roleSelectProps = {
      multiSelect: true,
      onRoleSelect(value) {
        setFieldsValue({ authorRoles: value });
      }
    };

    const specimenSelectProps = {
      multiSelect: false,
    };

    const unitOfMeasureSelectProps = {
      multiSelect: false,
    };

    // TODO hack to set default flags
    getFieldDecorator('criticalFlag', { initialValue: 'C'})
    getFieldDecorator('highFlag', { initialValue: 'H'})
    getFieldDecorator('lowFlag', { initialValue: 'L'})
    getFieldDecorator('normalFlag', { initialValue: 'N'})

    return (
      <PageHeaderLayout
        title="New Template definition"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <div id="advanced-form">
            <Row gutter={10}>
              <Card>
                <LocaleProvider locale={enUS}>
                  <Form>
                    <FormItem
                      {...formItemLayout}
                      label={(
                        <span>Type of Template&nbsp;
                          <Tooltip title={
                              <div>
                                <span>Departmental : mostly investigative templates.<br/></span>
                                <span>Medical : templates used by medical professions like doctors, nurses, etc to enter the patient treatment. <br/></span>
                              </div>
                            }
                          >
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>)}
                      hasFeedback>
                      {getFieldDecorator('templateType', {
                          rules: [{ required: true, message: 'Template Type must be specified' }],
                       })(
                         <RadioGroup onChange={this.templateTypeChangeHandler} style={{ float: 'left' }}>
                           <Radio value="DEPARTMENTAL">Departmental</Radio>
                           <Radio value="MEDICAL">Medical</Radio>
                         </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="Template Name" hasFeedback>
                      {getFieldDecorator('name', {
                          rules: [{ required: true, message: 'Template name must be specified' }],
                       })(
                         <Input onFocus={this.defaultTemplateNameHander} />
                        )}
                    </FormItem>

                    { isTemplateFormSectionVisible && (
                    <div>
                      { isDepartmentTemplateSectionVisible && (
                        <FormItem label="Product：" hasFeedback {...formItemLayout}>
                          {getFieldDecorator('product', {
                            rules: [
                              {
                                required: true,
                                message: 'Product must be specified',
                             },
                            ],
                         })(<ProductSelect {...productSelectProps} onProductSelect={this.productSelectHandler} />)}
                        </FormItem>
                      )}
                      <FormItem {...formItemLayout} label="Template Content Type" hasFeedback>
                        {getFieldDecorator('contentType', {
                              rules: [{ required: true, message: 'Template content type must be specified' }],
                           })(
                             <RadioGroup onChange={this.contentTypeChangeHandler} style={{ float: 'left' }}>
                               <Radio value="NARRATIVE">Narrative</Radio>
                               { isDepartmentTemplateSectionVisible && (
                                  <Radio value="STANDARD">Standard Definition</Radio>
                               )}
                               <Radio value="FORM">Form</Radio>
                               <Radio value="TABLE">Tabular</Radio>
                             </RadioGroup>
                            )}
                      </FormItem>
                      { isDepartmentTemplateSectionVisible && isStandardTypeFormSectionVisible && (
                        <div>
                          <FormItem label="Unit Of Measure:" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('unitOfMeasure', {})(<UnitOfMeasureSelect {...unitOfMeasureSelectProps} onUnitOfMeasureSelect={this.unitOfMeasureSelectHandler} />)}
                          </FormItem>

                          <FormItem label="Specimen:" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('specimen', {})(<SpecimenSelect {...specimenSelectProps} onSpecimenSelect={this.specimenSelectHandler} />)}
                          </FormItem>

                          <FormItem {...formItemLayout} label="Age Type" hasFeedback>
                            {getFieldDecorator('ageType', {
                                    rules: [{ required: true, message: 'Age Type must be specified' }],
                                 })(
                                   <RadioGroup style={{ float: 'left' }}>
                                     <Radio value="DAYS">Days</Radio>
                                     <Radio value="MONTHS">Months</Radio>
                                     <Radio value="YEARS">Years</Radio>
                                   </RadioGroup>
                                  )}
                          </FormItem>

                          <FormItem {...formItemLayout} label="Description" hasFeedback>
                            {getFieldDecorator('description', {})(
                              <TextArea rows={4} />
                                  )}
                          </FormItem>

                          <FormItem {...formItemLayout} label="Gender" hasFeedback>
                            {getFieldDecorator('gender', {
                                    rules: [{ required: true, message: 'Subject gender must be specified' }],
                                 })(
                                   <RadioGroup style={{ float: 'left' }}>
                                     <Radio value="FEMALE">Female</Radio>
                                     <Radio value="MALE">Male</Radio>
                                     <Radio value="ALL">All</Radio>
                                   </RadioGroup>
                                  )}
                          </FormItem>

                          <FormItem {...formItemLayout} label="Minimum Age" hasFeedback>
                            {getFieldDecorator('minAge', {
                                    rules: [{ required: true, message: 'Minumum age must be specified' }],
                                 })(
                                   <InputNumber min={0} />
                                  )}
                          </FormItem>

                          <FormItem {...formItemLayout} label="Maximum Age" hasFeedback>
                            {getFieldDecorator('maxAge', {
                                    rules: [{ required: true, message: 'Maximum age must be specified' }],
                                 })(
                                   <InputNumber min={0} />
                                  )}
                          </FormItem>

                          <FormItem {...formItemLayout} label="Tubes" hasFeedback>
                            {getFieldDecorator('tubes', {})(
                              <Input />
                                  )}
                          </FormItem>

                          <FormItem {...formItemLayout} label="Type of Range" hasFeedback>
                            {getFieldDecorator('rangeType', {
                                    rules: [{ required: true, message: 'Type of range must be specified' }],
                                 })(
                                   <RadioGroup onChange={this.rangeTypeChangeHandler} style={{ float: 'left' }}>
                                     <Radio value="REFERENCED">Referenced</Radio>
                                     <Radio value="NON_REFERENCED">Non-Referenced</Radio>
                                   </RadioGroup>
                                  )}
                          </FormItem>

                          { isNonReferencedRangeFormSectionVisible && (
                            <div>
                              <FormItem {...formItemLayout} label="Non-Referenced ranges" hasFeedback>
                                {getFieldDecorator('ranges', {
                                    rules: [{ required: true, message: 'Non-referenced ranges must be specified' }],
                                 })(
                                   <Select
                                      mode="tags"
                                      style={{ width: '100%' }}
                                      tokenSeparators={[',']}
                                    />
                                  )}
                              </FormItem>
                              <Row>
                                <Col span={14} offset={6}>
                                  <p>Seperate ranges with a comma e.g. Orange, Green, Yellow</p>
                                </Col>
                              </Row>
                            </div>
                          )}

                          { isReferencedRangeFormSectionVisible && (
                          <div>

                            <FormItem {...formItemLayout} label="High Value" hasFeedback>
                              {getFieldDecorator('highValue', {
                                  rules: [{ required: true, message: 'High value must be specified' }],
                               })(
                                 <Input style={{ width: '30%' }} />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="Low Value" hasFeedback>
                              {getFieldDecorator('lowValue', {
                                  rules: [{ required: true, message: 'Low value must be specified' }],
                               })(
                                 <Input style={{ width: '30%' }} />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="Critical High Value" hasFeedback>
                              {getFieldDecorator('criticalHighValue', {
                                rules: [],
                               })(
                                 <Input style={{ width: '30%' }} />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="Critical Low Value" hasFeedback>
                              {getFieldDecorator('criticalLowValue', {
                                  rules: [],
                               })(
                                 <Input style={{ width: '30%' }} />
                                )}
                            </FormItem>

                            {/*
                              <Row style={{ marginBottom: 10 }}>
                                <Col span={20} offset={4}>
                                  <InputGroup>
                                    <Col span={8}>

                                    </Col>
                                    <Col span={8}>

                                    </Col>
                                    <Col span={6}>
                                      <FormItem {...formItemLayout} label="Critical Flag" hasFeedback>
                                        {getFieldDecorator('criticalFlag', {
                                                  rules: [{ required: true, message: 'Critical Flag must be specified' }],
                                               })(
                                                 <Input />
                                                )}
                                      </FormItem>
                                    </Col>
                                  </InputGroup>

                                  <InputGroup size="large">
                                    <Col span={6}>
                                      <FormItem {...formItemLayout} label="High Flag" hasFeedback>
                                        {getFieldDecorator('highFlag', {
                                                  rules: [{ required: true, message: 'High flag must be specified' }],
                                               })(
                                                 <Input />
                                                )}
                                      </FormItem>
                                    </Col>
                                    <Col span={8}>

                                    </Col>
                                  </InputGroup>

                                  <InputGroup size="large">
                                    <Col span={6}>
                                      <FormItem {...formItemLayout} label="Low Flag" hasFeedback>
                                        {getFieldDecorator('lowFlag', {
                                                  rules: [{ required: true, message: 'Low flag must be specified' }],
                                               })(
                                                 <Input />
                                                )}
                                      </FormItem>
                                    </Col>
                                    <Col span={8}>

                                    </Col>
                                  </InputGroup>

                                  <FormItem {...formItemLayout} label="Normal Flag" hasFeedback>
                                    {getFieldDecorator('normalFlag', {
                                              rules: [{ required: true, message: 'Normal flag must be specified' }],
                                           })(
                                             <Input />
                                            )}
                                  </FormItem>
                                </Col>
                              </Row>
                            */}

                          </div>
                        )}
                      </div>
                      )}

                      { isDatasheetDesignerSectionVisible && (
                        <FormItem {...formItemLayout} label="Table" hasFeedback>
                          {getFieldDecorator('content', {
                              rules: [{ required: isNarrativeFormItemRequired, message: 'Tabular form components must be specified' }],
                           })(<DatasheetDesignerDesigner onContentChange={this.contentChangeHandler} />)}
                        </FormItem>
                      )}

                      { isNarrativeTypeFormSectionVisible && (
                        <FormItem {...formItemLayout} label="Narrative" hasFeedback>
                          {getFieldDecorator('content', {
                              rules: [{ required: isNarrativeFormItemRequired, message: 'Narrative must be specified' }],
                           })(
                             <CustomEditor onContentChange={this.contentChangeHandler} />
                            )}
                        </FormItem>
                      )}

                      { isFormDesignSectionVisible && (
                        <FormItem {...formItemLayout} label="Form" hasFeedback>
                          {getFieldDecorator('content', {
                              rules: [{ required: isNarrativeFormItemRequired, message: 'Form must be specified' }],
                           })(
                             <FormDesigner onEditorChange={this.contentChangeHandler} />
                            )}
                        </FormItem>
                      )}

                      { isAuthorRolesSectionVisible && (
                        <FormItem {...formItemLayout} label="Roles" hasFeedback>
                          {getFieldDecorator('authorRoles', {})(<RoleSelect {...roleSelectProps} />)}
                        </FormItem>
                      )}

                      <div style={{ marginTop: 10 }}>
                        <FormItem {...noLabelTailFormItemLayout}>
                          <Button
                            type="danger"
                            icon="close"
                            onClick={this.handleCancel}
                            style={{ marginRight: 10 }}
                          >Cancel
                          </Button>
                          <Button
                            type="primary"
                            icon="save"
                            onClick={this.handleSubmitAndClose}
                            style={{ marginRight: 10 }}
                            disabled={this.hasErrors(getFieldsError())}
                          >Save &amp; Close
                          </Button>
                          <Button
                            type="primary"
                            icon="save"
                            onClick={this.handleSubmitAndNew}
                            disabled={this.hasErrors(getFieldsError())}
                          >Save &amp; New
                          </Button>
                        </FormItem>
                      </div>

                    </div>
                  )}

                  </Form>
                </LocaleProvider>
              </Card>
            </Row>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default TemplateForm;
