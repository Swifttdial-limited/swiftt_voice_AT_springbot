import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ visitTypes, loading }) => ({
  visitTypes,
  loading: loading.effects['visitTypes/query']
}))
class VisitTypeSelect extends PureComponent {

  static defaultProps = {
    editValues: [],
    multiSelect: false,
  };

  static propTypes = {
    editValues: PropTypes.array,
    multiSelect: PropTypes.bool.isRequired,
    visitTypes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    onVisitTypeSelect: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'visitTypes/query' });
  }

  handleVisitTypeSelectChange = (value, e) => {
    const { multiSelect, visitTypes, onVisitTypeSelect } = this.props;
    const { list } = visitTypes;

    if (!multiSelect) { onVisitTypeSelect(value ? list[value] : null); } else { onVisitTypeSelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { visitTypes } = this.props;
    const { list } = visitTypes;

    const selectedVisitTypes = [];
    value.forEach((itemIndex) => {
      selectedVisitTypes.push(list[itemIndex]);
    });

    return selectedVisitTypes;
  }

  render() {
    const { editValues, multiSelect, visitTypes } = this.props;
    const { list, loading } = visitTypes;

    let selectProps = {};
    if(editValues && editValues.length > 0) {
      selectProps.defaultValue = editValues.map((visitType) => visitType.name );
    }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder={multiSelect ? 'Select visit type(s)' : 'Select visit type'}
        onChange={this.handleVisitTypeSelectChange}
        filterOption={false}
      >
        {list.map((visitType, index) => (
          <Option key={index} value={index.toString()}>
            {visitType.name} {visitType.requiresAdmission ? '(Requires admission)' : ''} {visitType.hasValidityDuration ? `(Valid for ${visitType.validityDuration} hours)` : ''}
          </Option>
        ))}
      </Select>
    );
  }
}

export default VisitTypeSelect;
