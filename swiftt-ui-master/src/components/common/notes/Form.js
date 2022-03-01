import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Checkbox, Input, Button, Tooltip, Icon, LocaleProvider, Row, Col, Card } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import CustomEditor from '../CustomEditor';
import DatasheetRenderer from '../datasheet/renderer';
import FormRenderer from '../form-renderer';
import TemplateSelect from '../TemplateSelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 21,
      offset: 3,
    },
    sm: {
      span: 21,
      offset: 3,
    },
  },
};

@Form.create()
class NoteForm extends PureComponent {

  static propTypes = {
    form: PropTypes.object,
    item: PropTypes.object,
  };

  state = {
    formRenderSectionVisible: false,
    narrativeSectionVisible: false,
    tableRenderedSectionVisible: false,
    rawContent: '',
  };

  componentWillReceiveProps(nextProps) {
    if('item' in nextProps) {
      if(nextProps.item.id !== undefined) {
        // on edit, show relevant Component
      }
    }
  }

  handleSave = () => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ published: false });

    this.handleSubmit();
  }

  handlePublish = () => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ published: true });

    this.handleSubmit();
  }

  handleSubmit = () => {
    const { form, onOk } = this.props;
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

  handleCancel = () => {
    this.props.onCancel();
  }

  editorChangeHandler = (rawContent, content) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    this.setState({ rawContent: rawContent }, () => {
      setFieldsValue({ rawBody: rawContent, body: content });
    });
  }

  publishableToggleHandler = e => this.props.form.setFieldsValue({ open: e.target.value });

  templateSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    this.setState({
      formRenderSectionVisible: false,
      narrativeSectionVisible: false,
      tableRenderedSectionVisible: false,
      rawContent: '',
    });

    if(value) {
      if(value.contentType === 'FORM') {
        this.setState({
          formRenderSectionVisible: true,
          rawContent: value.content,
        }, () => {
          setFieldsValue({ title: value.name, template: value });
          //this.editorChangeHandler(value.content);
        });
      } else if(value.contentType === 'NARRATIVE') {
        this.setState({
          narrativeSectionVisible: true,
          rawContent: value.content,
        }, () => {
          setFieldsValue({ title: value.name, template: value });
          //this.editorChangeHandler(value.content);
        });
      } else if(value.contentType === 'TABLE') {
        this.setState({
          tableRenderedSectionVisible: true,
          rawContent: value.content,
        }, () => {
          setFieldsValue({ title: value.name, template: value });
          //this.editorChangeHandler(value.content);
        });
      }
      //setFieldsValue({ title: value.name, template: value });
    } else {
      // this.setState({ tableRenderedSectionVisible: false, narrativeSectionVisible: false, formRenderSectionVisible: false }, () => {
      //   this.editorChangeHandler(value.content);
      //   setFieldsValue({ title: null, template: value });
      // });
    }
  }

  render() {
    const { form, item } = this.props;
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      getFieldValue,
      setFieldsValue
    } = form;

    const {
      narrativeSectionVisible,
      formRenderSectionVisible,
      tableRenderedSectionVisible,
      rawContent,
      content
    } = this.state;

    getFieldDecorator('title', {
      rules: [{ required: true, message: 'Title must be specified' }],
    });

    getFieldDecorator('body', {
      rules: [{ required: true, message: 'Body must be specified' }],
    });

    getFieldDecorator('rawBody', {
      rules: [{ required: true, message: 'Body must be specified' }],
    });

    getFieldDecorator('published', {
      rules: [{ required: true, message: 'Body must be specified' }],
    });

    const customEditorProps = {
      rawContent: rawContent,
    };

    const datasheetRendererProps = {
      rawContent: rawContent,
    };

    const formRenderedProps = {
      rawContent: rawContent,
    };

    const renderCustomEditor = () => <CustomEditor {...customEditorProps} onContentChange={(raw, html) => this.editorChangeHandler(raw, html)} />
    const renderDatasheetRenderer = () => <DatasheetRenderer {...datasheetRendererProps} onContentChange={(raw, html) => this.editorChangeHandler(raw, html)} />
    const renderFormRendered = () => <FormRenderer {...formRenderedProps} onContentChange={(raw, html) => this.editorChangeHandler(raw, html)} />

    return (
      <Card>
        <LocaleProvider locale={enUS}>
          <Form layout="horizontal">
            <FormItem label="Template" hasFeedback {...formItemLayout}>
              {getFieldDecorator('template', {
                 initialValue: item.template ? item.template : null,
                 rules: [{ required: true, message: 'Body must be specified' }],
              })(<TemplateSelect
                templateType="MEDICAL"
                onTemplateSelect={this.templateSelectHandler}
              />)}
            </FormItem>

            <Row style={{ marginTop: 10 }}>
              <Col span={21} offset={3}>
                { formRenderSectionVisible ? renderFormRendered() : null}
                { narrativeSectionVisible ? renderCustomEditor() : null}
                { tableRenderedSectionVisible ? renderDatasheetRenderer() : null}
              </Col>
            </Row>

            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('open', {
                valuePropName: 'checked',
               initialValue: item.open ? item.open : true,
            })(
              <Checkbox onChange={this.publishableToggleHandler}>
                <span>Mark note as open?&nbsp;
                  <Tooltip title="Public notes are accessible by all users. Private notes are only accessible by their authors">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              </Checkbox>)
            }
            </FormItem>
            <div style={{ marginTop: 10 }}>
              <FormItem {...tailFormItemLayout}>
                <Button
                  type="danger"
                  icon="close"
                  onClick={this.handleCancel}
                  style={{ marginRight: 10 }}
                >Cancel
                </Button>
                <Button
                  disabled={!(item.id || (getFieldValue('body') !== undefined))}
                  type="primary"
                  icon="save"
                  onClick={this.handleSave}
                  style={{ marginRight: 10 }}
                  >Save as Draft</Button>
                <Button
                  disabled={!(item.id || (getFieldValue('body') !== undefined) && !item.published)}
                  type="primary"
                  icon="save"
                  onClick={this.handlePublish}
                >Publish as Completed</Button>
              </FormItem>
            </div>
          </Form>
        </LocaleProvider>
      </Card>
    );
  }
}

export default NoteForm;
