import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import mapKeys from 'lodash';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ triageCategories, loading }) => ({
  triageCategories,
  loading: loading.effects['triageCategories/query'],
}))
class TriageCategorySelect extends PureComponent {
  static defaultProps = {
    isControlTriageCategory: false,
    isVisible: false,
    multiSelect: false,
  };

  static propTypes = {
    triageCategories: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    isControlTriageCategory: PropTypes.bool,
    isVisible: PropTypes.bool,
    multiSelect: PropTypes.bool.isRequired,
    onTriageCategorySelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.triageCategorySearchHandler = debounce(this.triageCategorySearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'triageCategories/query' });
  }

  triageCategorySearchHandler = (value) => {
    const { dispatch, isControlTriageCategory, isVisible } = this.props;

    if (value.length > 2) {
      const payload = { name: value };

      if (isControlTriageCategory) { payload.controlTriageCategory = true; }

      if (isVisible) { payload.visible = true; }

      dispatch({ type: 'triageCategories/query', payload });
    }
  }

  handleTriageCategorySelectChange = (value, e) => {
    const { triageCategories, multiSelect, onTriageCategorySelect } = this.props;
    const { list } = triageCategories;

    if (!multiSelect) { onTriageCategorySelect(value ? list[value] : null); } else { onTriageCategorySelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { triageCategories } = this.props;
    const { list } = triageCategories;

    const selectedTriageCategories = [];
    value.forEach((itemIndex) => {
      selectedTriageCategories.push(list[itemIndex]);
    });

    return selectedTriageCategories;
  }

  render() {
    const { triageCategories, editValue, multiSelect } = this.props;
    const { list, loading } = triageCategories;

    const selectProps = {};

    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No triage category matching search criteria found'}
        placeholder={multiSelect ? 'Select triage category(s)' : 'Select triage category'}
        showSearch
        onChange={this.handleTriageCategorySelectChange}
        onSearch={this.triageCategorySearchHandler}
        filterOption={false}
      >
        {list.map((triageCategory, index) => <Option key={index} value={index.toString()}>{triageCategory.name}</Option>)}
      </Select>
    );
  }
}

export default TriageCategorySelect;
