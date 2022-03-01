import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ tagTypes, loading }) => ({
  tagTypes,
  loading: loading.effects['tagTypes/query']
}))
class TagTypeSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
  };

  static propTypes = {
    tagTypes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onTagTypeSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.tagTypeSearchHandler = debounce(this.tagTypeSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tagTypes/query' });
  }

  handleTagTypeSelectChange = (value, e) => {
    const { tagTypes, onTagTypeSelect } = this.props;
    const { list } = tagTypes;

    onTagTypeSelect(value ? list[value] : null);
  }

  tagTypeSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) {
      const payload = { name: value };
      dispatch({ type: 'tagTypes/query', payload });
    }
  }

  render() {
    const { tagTypes, editValue, multiSelect } = this.props;
    const { list, loading } = tagTypes;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No tag type matching search criteria found'}
        placeholder={multiSelect ? 'Select Tag type(s)' : 'Select Tag type'}
        showSearch
        onChange={this.handleTagTypeSelectChange}
        onSearch={this.tagTypeSearchHandler}
        filterOption={false}
      >
        {list.map((tagType, index) => <Option key={index} value={index.toString()}>{tagType.name}</Option>)}
      </Select>
    );
  }
}

export default TagTypeSelect;
