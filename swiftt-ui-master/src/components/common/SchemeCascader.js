import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { filter, forEach, map, orderBy, uniq } from 'lodash';
import { Cascader } from 'antd';

@connect(({ schemes, loading }) => ({
  schemes,
  loading: loading.effects['schemes/query'],
}))
class SchemeCascader extends PureComponent {

  static defaultProps = {
    disabled: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    schemes: PropTypes.object,
    onSchemeSelect: PropTypes.func.isRequired,
  };

  state = { schemeCount: 0, options: [] };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'schemes/query', payload: { size: 10000 } });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.schemes.list.length != this.state.schemeCount) { this.generateSchemeOptions(nextProps.schemes.list); }
  }

  onChange = (value, selectedOptions) => {
    const { schemes, onSchemeSelect } = this.props;
    const { list } = schemes;

    if (selectedOptions.length == 2) {
      const scheme = filter(list, ['id', selectedOptions[selectedOptions.length - 1].value])[0];
      onSchemeSelect(scheme || null);
    }
  }

  generateSchemeOptions = (list) => {
    this.setState({ schemeCount: list.length });
    orderBy(
      map(
        uniq(
          map(list, scheme => JSON.stringify(scheme.contact))
        ),
        contact => JSON.parse(contact)
      ),
      ['name'], ['asc']
    ).forEach(contact => this.state.options.push(
      { value: contact.publicId, label: contact.name, isLeaf: false }
    ));

    this.setState({ options: [...this.state.options] });
  }

  loadData = (selectedOptions) => {
    const { schemes } = this.props;
    const { list } = schemes;

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.children = [];

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;

      filter(list, ['contact.publicId', targetOption.value]).forEach((scheme) => {
        targetOption.children.push({
          label: scheme.name,
          value: scheme.id,
        });
      });

      this.setState({
        options: [...this.state.options],
      });
    }, 500);
  }

  render() {
    const { disabled } = this.props;

    return (
      <Cascader
        disabled={disabled}
        notFoundContent="Oops! No contacts defined"
        placeholder="Select contact and scheme"
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}

export default SchemeCascader;
