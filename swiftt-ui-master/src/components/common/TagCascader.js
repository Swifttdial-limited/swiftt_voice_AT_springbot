import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { filter, forEach, map, orderBy, uniq } from 'lodash';
import { Cascader } from 'antd';

@connect(({ tags, loading }) => ({
  tags,
  loading: loading.effects['tags/query'],
}))
class TagCascader extends PureComponent {

  static defaultProps = {
    disabled: false,
    onTagSelect: () => {},
  };

  static propTypes = {
    disabled: PropTypes.bool,
    tags: PropTypes.object,
    onTagSelect: PropTypes.func.isRequired,
  };

  state = { tagCount: 0, options: [] };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tags/query', payload: { size: 10000 } });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tags.list.length != this.state.tagCount) {
      this.generateTagOptions(nextProps.tags.list);
    }
  }

  onChange = (value, selectedOptions) => {
    const { tags, onTagSelect } = this.props;
    const { list } = tags;

    if (selectedOptions.length == 2) {
      const tag = filter(list, ['id', selectedOptions[selectedOptions.length - 1].value])[0];
      onTagSelect(tag || null);
    }
  }

  generateTagOptions = (list) => {
    this.setState({ tagCount: list.length });
    orderBy(
      map(
        uniq(
          map(list, tag => JSON.stringify(tag.type))
        ),
        type => JSON.parse(type)
      ),
      ['name'], ['asc']
    ).forEach(type => this.state.options.push(
      { value: type.publicId, label: type.name, isLeaf: false }
    ));

    this.setState({ options: [...this.state.options] });
  }

  loadData = (selectedOptions) => {
    const { tags } = this.props;
    const { list } = tags;

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.children = [];

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;

      filter(list, ['type.publicId', targetOption.value]).forEach((tag) => {
        targetOption.children.push({
          label: tag.name,
          value: tag.id,
        });
      });

      this.setState({
        options: [...this.state.options],
      });
    }, 500);
  }

  render() {
    const { disabled, multiSelect } = this.props;

    return (
      <Cascader
        disabled={disabled}
        notFoundContent="Oops! No types defined"
        placeholder="Select type and tag"
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}

export default TagCascader;
