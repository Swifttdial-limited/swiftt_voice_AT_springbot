import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Radio,
  DatePicker,
  Button,
  LocaleProvider
} from 'antd';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from 'react-html-parser';
import enUS from 'antd/lib/locale-provider/en_US';

import $ from 'jquery';

window.jQuery = $;
window.$ = $;
require('formBuilder/dist/form-render.min.js');

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;

let fields = [
  {
    label: 'Line Break',
    type: 'break',
    icon: ' — '
  }
];

let templates = {
  break: function(fieldData) {
      return {
        field: '<hr class='+fieldData.className+'>'
      };
    }
};

let originalFormDataHTML = '';
let originalFormData = '';

@Form.create()
class FormRenderer extends PureComponent {

  static defaultProps = {
    rawContent: '',
    onContentChange: () => {},
  };

  static propTypes = {
    rawContent: PropTypes.string,
    onContentChange: PropTypes.func,
  };

  state = {
    rawContent: '',
    html: <span></span>,
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.rawContent) {
      if(nextProps.rawContent[0] === '"') {
        originalFormData = JSON.parse(JSON.parse(nextProps.rawContent));
        this.formRenderHandler();
      } else {
        originalFormData = JSON.parse(nextProps.rawContent);
        this.formRenderHandler();
      }
    } else {

    }
  }

  formRenderHandler = () => {
    const { rawContent } = this.props;

    let mk = $("#shadow-markup");
    let frOptions = {
      container: false,
      formData: JSON.stringify(originalFormData),
      dataType: 'json',
      subtypes: {
        text: ['datetime-local']
      },
      fields: fields,
      templates: templates,
      render: true,
      notify: {
        error: function(message) {
          return console.error(message);
        },
        success: function(message) {
          return console.log(message);
        },
        warning: function(message) {
          return console.warn(message);
        }
      }
    };

    mk.formRender(frOptions);
    originalFormDataHTML = mk.html();
  }

  getObj = (objs, key, val) => {
    val = val.replace('[]', '');
    return objs.filter(function(obj) {
      var filter = false;
      if (val) {
        filter = (obj[key] === val);
      } else if (obj[key]) {
        filter = true;
      }
      return filter;
    });
  }

  setValue = (content, name, value) => {
    let field = this.getObj(content, 'name', name)[0];

    if (!field) {
      return;
    }

    if (['select', 'checkbox-group', 'radio-group'].indexOf(field.type) !== -1) {
      for (var fieldOption of field.values) {
        if (value.indexOf(fieldOption.value) !== -1) {
          fieldOption.selected = true;
        } else {
          delete fieldOption.selected;
        };
      }
    } else {
      field.value = value;
    }
  }

  onSaveHandler = () => {
    const { form, onContentChange, rawContent } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };

      var fbRender = $("#markup");
      var formData = new FormData(fbRender);

      for (var key of formData.keys()) {
        this.setValue(originalFormData, key, formData.getAll(key));
      }

      originalFormData.forEach((element) => {
        if(element.type === 'text' && element.name !== undefined) {
          element.value = $('#markup #' + element.name).val()
        }
      });

      onContentChange(JSON.stringify(originalFormData), $("#markup").html());
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const transform = (node, index) => {
      if (node.type === 'tag' && node.name === 'input' && node.attribs.type === 'checkbox') {
        console.log(node)
      }

      if (node.type === 'tag' && node.name === 'input' && (
        node.attribs.type === 'date' || node.attribs.type === 'number' || node.attribs.type === 'text'
      )) {
        let formElement = <Input />;
        let formItemOptions = {};

        if(node.attribs.type === 'date') {
          formElement = <DatePicker />;
        } else if(node.attribs.type === 'number') {
          formElement = <InputNumber
            placeholder={node.attribs.placeholder ? node.attribs.placeholder : null}
            style={{ width: '150px' }} />;
        } else if(node.attribs.type === 'text') {
          formElement = <Input name={node.attribs.name ? node.attribs.name : null} />;
        }

        if(node.attribs.required) {
          formItemOptions.rules = [
            {
              required: true,
              message: 'Field must be specified',
            }
          ];
        }

        return (
          <FormItem hasFeedback key={node.attribs.id}>
            {getFieldDecorator(node.attribs.id, formItemOptions)(formElement)}
          </FormItem>
        )
      }

      if (node.type === 'tag' && node.name === 'select') {
        let selectProps = {};

        if(node.children.length > 0) {
          node.children.forEach(function(child) {
            // build placeholder
            if((child.attribs.value === null || child.attribs.value === undefined) && (child.prev === null || child.prev === undefined)) {
              selectProps.placeholder = child.children[0].data;
            }
          })
        }

        let formElement = (
          <Select {...selectProps}>
            {node.children.map(child => {
              // build options
              if((child.attribs.value !== null || child.attribs.value !== undefined)) {
                return <Option value={child.attribs.value}>{child.children[0].data}</Option>
              }
            })}
          </Select>
        );

        let formItemOptions = {};
        if(node.attribs.required) {}

        return (
          <FormItem hasFeedback key={node.attribs.id}>
            {getFieldDecorator(node.attribs.id, formItemOptions)(formElement)}
          </FormItem>
        )
      }

      if (node.type === 'tag' && node.name === 'textarea') {
        let formElement = <TextArea rows={2} />;
        let formItemOptions = {};
        if(node.attribs.required) {}

        return (
          <FormItem hasFeedback key={node.attribs.id}>
            {getFieldDecorator(node.attribs.id, formItemOptions)(formElement)}
          </FormItem>
        )
      }

      // return null to block certain elements
      // don't allow <span> elements
      if (node.type === 'tag' && node.name === 'span') {
        return null;
      }

      // Transform <ul> into <ol>
      // A node can be modified and passed to the convertNodeToElement function which will continue to render it and it's children
      if (node.type === 'tag' && node.name === 'ul') {
        node.name = 'ol';
        return convertNodeToElement(node, index, transform);
      }

      // return an <i> element for every <b>
      // a key must be included for all elements
      if (node.type === 'tag' && node.name === 'b') {
        return <i key={index}>I am now in italics, not bold</i>;
      }

      // all links must open in a new window
      if (node.type === 'tag' && node.name === 'a') {
        node.attribs.target = '_blank';
        return convertNodeToElement(node, index, transform);
      }

    }

    const options = {
      decodeEntities: true,
      transform
    };

    return(
      <div style={{ marginTop: 10 }}>
        {/* used just for generating markup */}
        <div id="shadow-markup" style={{ display: 'none' }}></div>

        <div id="markup">
          <LocaleProvider locale={enUS}>
            <Form layout="horizontal">
              { ReactHtmlParser(originalFormDataHTML, options) }
            </Form>
          </LocaleProvider>
        </div>
        <br/>
        <Button icon="check" onClick={this.onSaveHandler}>Mark template as Filled</Button>
      </div>
    );
  }

}

export default FormRenderer;
