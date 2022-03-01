import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { filter } from 'lodash';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ identificationTypes, loading }) => ({
  identificationTypes,
  loading: loading.effects['identificationTypes/query'],
}))
class IdentificationTypeSelect extends PureComponent {
  static defaultProps = {
    disabled: false,
  };

  static propTypes = {
    identificationTypes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    onIdentificationTypeSelect: PropTypes.func.isRequired,
    minimumRequiredAge: PropTypes.number,
    target: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { dispatch, target } = this.props;

    let data = {};

    if (target === 'Person') { data = { isPerson: true }; } else if (target === 'Contact') { data = { isContact: true }; }
    dispatch({ type: 'identificationTypes/query', payload: data });
  }

  handleIdentificationTypeSelectChange = (value, e) => {
    const { identificationTypes, onIdentificationTypeSelect } = this.props;
    const { list } = identificationTypes;
    onIdentificationTypeSelect(list[value]);
  }

  render() {
    const { disabled, editValue, identificationTypes, minimumRequiredAge } = this.props;
    const { list, loading } = identificationTypes;

    const selectOptions = [];
    if (minimumRequiredAge !== null && minimumRequiredAge !== undefined) {
      filter(list, (o) => { return o.minimumRequiredAge <= minimumRequiredAge; })
        .map((identificationType, index) => selectOptions.push(
          <Option key={index} value={index.toString()}>
            {identificationType.name} {identificationType.minimumRequiredAge ? `(${identificationType.minimumRequiredAge} years and above)` : null}
          </Option>
        ));
    } else {
      list.map((identificationType, index) => selectOptions.push(
        <Option key={index} value={index.toString()}>
          {identificationType.name} {identificationType.minimumRequiredAge ? `(${identificationType.minimumRequiredAge} years and above)` : null}
        </Option>
      ));
    }

    let selectProps = {};
    if (editValue)
      selectProps.defaultValue = editValue;

    return (
      <Select
        allowClear
        {...selectProps}
        disabled={disabled}
        style={{ width: 300 }}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Select identification type"
        onChange={this.handleIdentificationTypeSelectChange}
        filterOption={false}
      >
        {selectOptions}
      </Select>
    );
  }
}

export default IdentificationTypeSelect;
