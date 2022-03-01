import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ depositDefinitions, loading }) => ({
  depositDefinitions,
  loading: loading.effects['depositDefinitions/query'],
}))
class DepositDefinitionSelect extends PureComponent {

  static propTypes = {
    depositDefinitions: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    editValue: PropTypes.string,
    onDepositDefinitionSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.depositDefinitionSearchHandler = debounce(this.depositDefinitionSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'depositDefinitions/query'});
  }

  depositDefinitionSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'depositDefinitions/query', payload: { searchQueryParam: value } }); }
  }

  depositDefinitionSelectChangeHandler = (value, e) => {
    const { depositDefinitions, onDepositDefinitionSelect } = this.props;
    const { list } = depositDefinitions;

    onDepositDefinitionSelect(value ? list[value] : null);
  }

  handleBlur = () => {}

  render() {
    const { depositDefinitions, editValue } = this.props;
    const { list, loading } = depositDefinitions;

    return (
      <Select
        allowClear
        defaultValue={editValue}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search deposit definitions"
        showSearch
        style={{ width: 300 }}
        onChange={this.depositDefinitionSelectChangeHandler}
        onSearch={this.depositDefinitionSearchHandler}
        filterOption={false}
      >
        {list.map((depositDefinition, index) => <Option key={index} value={index.toString()}>{depositDefinition.name} ({depositDefinition.requiredDepositAmount})</Option>)}
      </Select>
    );
  }
}

export default DepositDefinitionSelect;
