import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import { map } from 'lodash';
import debounce from 'lodash.debounce';

const Option = Select.Option;

@connect(({ tags, loading }) => ({
  tags,
  loading: loading.effects['tags/query']
}))
class TagSelect extends PureComponent {

  static defaultProps = {
    mode: '',
    multiSelect: false,
  };

  static propTypes = {
    tags: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    mode: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onTagSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleTagSearch = debounce(this.handleTagSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tags/query' });
  }

  handleTagSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'tags/query', payload: { name: value } }); }
  }

  handleTagSelectChange = (value, e) => {
    const { multiSelect, onTagSelect } = this.props;

    if (!multiSelect) {
      onTagSelect(this.mapSelectedValueToTag(value));
    } else {
      onTagSelect(this.mapSelectedValuesToTag(value));
    }
  }

  mapSelectedValueToTag = (selectedTag) => {
    const { tags } = this.props;
    const { list } = tags;

    list.forEach((tag) => {
      if(selectedTag.key === tag.publicId) {
        return tag;
      }
    })
  }

  mapSelectedValuesToTag = (values) => {
    const { tags } = this.props;
    const { list } = tags;

    const selectedTags = [];
    values.forEach((selectedTag) => {
      list.forEach((tag) => {
        if(selectedTag.key === tag.publicId) {
          selectedTags.push(tag);
        }
      });
    });

    return selectedTags;
  }

  render() {
    const { editValue, multiSelect, tags } = this.props;
    const { list, loading } = tags;

    const generateLabel = (tag) => Object.assign({}, { key: tag.publicId, label: tag.name + ' (' + tag.type.name + ')' });

    const generateTagTokens = (tags) => map(tags, (tag) => {
      return generateLabel(tag);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateTagTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        placeholder={multiSelect ? 'Select tags' : 'Select tag'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No tag matching search criteria found'}
        onChange={this.handleTagSelectChange}
        onSearch={this.handleTagSearch}
        filterOption={false}
      >
        {list.map((tag, index) => <Option key={index} value={tag.publicId}>{generateLabel(tag).label}</Option>)}
      </Select>
    );
  }
}

export default TagSelect;
