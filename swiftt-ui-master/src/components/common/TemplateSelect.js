import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/medical-records/templates';

const Option = Select.Option;

class TemplateSelect extends PureComponent {

  static defaultProps = {
    onTemplateSelect: () => {},
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.object,
    templateType: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onTemplateSelect: PropTypes.func.isRequired,
  };

  state = {
    templates: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.templateSearchHandler = debounce(this.templateSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchTemplates();
  }

  templateSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchTemplates(value);
    }
  }

  fetchTemplates = (searchQueryParam) => {
    const { templateType } = this.props;

    this.setState({ loading: true });

    query({
      ...(templateType != undefined && { templateType: templateType }),
      ...(searchQueryParam != undefined && { searchParam: searchQueryParam })
    }).then((response) => {
      this.setState({ templates: response.content, loading: false });
    }).catch((e) => {
      this.setState({ templates: [], loading: false });
    });;
  }

  handleTemplateSelectChange = (value, e) => {
    const { multiSelect, onTemplateSelect } = this.props;

    if (!multiSelect) {
      onTemplateSelect(this.mapSelectedValueToTemplate(value));
    } else {
      onTemplateSelect(this.mapSelectedValuesToTemplate(value));
    }
  }

  mapSelectedValueToTemplate = (selectedTemplate) => {
    const { templates } = this.state;
    return find(templates, { id: selectedTemplate.key});
  }

  mapSelectedValuesToTemplate = (values) => {
    const { templates } = this.state;

    const selectedTemplates = [];
    values.forEach((selectedTemplate) => {
      selectedTemplates.push({ name: selectedTemplate.label, id: selectedTemplate.key });
    })

    return selectedTemplates;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { templates, loading } = this.state;

    const generateLabel = (template) =>
      Object.assign({}, { key: template.id, label: template.name });

    const generateTemplateTokens = (accs) => map(accs, (template) => {
      return generateLabel(template);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateTemplateTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        style={{...style}}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select template(s)' : 'Select template'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No template matching search criteria found'}
        onChange={this.handleTemplateSelectChange}
        onSearch={this.templateSearchHandler}
        filterOption={false}>
        {templates.map((template, index) => <Option key={index} value={template.id}>{generateLabel(template).label}</Option>)}
      </Select>
    );
  }
}

export default TemplateSelect;
