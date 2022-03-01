import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { filter, forEach, map, orderBy, uniq } from 'lodash';
import { Cascader } from 'antd';

@connect(({ roles }) => ({
  roles,
}))
class RoleCascader extends PureComponent {
  state = { roleCount: 0, options: [] };

  static propTypes = {
    roles: PropTypes.object,
    onRoleSelect: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'roles/query' });
  }

  onChange = (value, selectedOptions) => {
    const { roles, onRoleSelect } = this.props;
    const { list } = roles;

    if (selectedOptions.length == 2) {
      const role = filter(list, ['id', selectedOptions[selectedOptions.length - 1].value])[0];
      onRoleSelect(role || null);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.roles.list.length != this.state.roleCount) { this.generateRoleOptions(nextProps.roles.list); }
  }

  generateRoleOptions = (list) => {
    this.setState({ roleCount: list.length });
    orderBy(
      map(
        uniq(
          map(list, role => JSON.stringify(role.actor))
        ),
        actor => JSON.parse(actor)
      ),
      ['name'], ['asc']
    ).forEach(actor => this.state.options.push(
      { value: actor.publicId, label: actor.name, isLeaf: false }
    ));

    this.setState({ options: [...this.state.options] });
  }

  loadData = (selectedOptions) => {
    const { roles } = this.props;
    const { list } = roles;

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.children = [];

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;

      filter(list, ['actor.publicId', targetOption.value]).forEach((role) => {
        targetOption.children.push({
          label: role.name,
          value: role.id,
        });
      });

      this.setState({
        options: [...this.state.options],
      });
    }, 500);
  }

  render() {
    return (
      <Cascader
        notFoundContent="Oops! No groups defined"
        placeholder="Select group and role"
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}

export default RoleCascader;
