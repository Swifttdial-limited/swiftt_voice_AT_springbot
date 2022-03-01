import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class StrengthSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.handleStrengthSearch = debounce(this.handleStrengthSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_strengths/query' });
  }

  handleStrengthSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'catalogue_strengths/query', payload: { searchQueryParam: value } }); }
  }

  handleStrengthSelectChange = (value, e) => {
    const { catalogue_strengths, onStrengthSelect, multiSelect } = this.props;
    const { list } = catalogue_strengths;

    if (!multiSelect) { onStrengthSelect(list[value]); } else { onStrengthSelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { catalogue_strengths } = this.props;
    const { list } = catalogue_strengths;

    const selectedStrengths = [];
    value.forEach((itemIndex) => {
      selectedStrengths.push(list[itemIndex]);
    });

    return selectedStrengths;
  }

  render() {
    const { catalogue_strengths, multiSelect, editValue } = this.props;
    const { list, loading } = catalogue_strengths;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No strength matching search criteria found'}
        placeholder={multiSelect ? 'Select strength(s)' : 'Select strength'}
        showSearch
        onChange={this.handleStrengthSelectChange}
        onSearch={this.handleStrengthSearch}
        filterOption={false}
      >
        {list.map((strength, index) => <Option key={index} value={index.toString()}>{strength.strengthName}</Option>)}
      </Select>
    );
  }
}

StrengthSelect.propTypes = {
  catalogue_strengths: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  multiSelect: PropTypes.bool.isRequired,
  onStrengthSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ catalogue_strengths }) {
  return { catalogue_strengths };
}

export default connect(mapStateToProps)(StrengthSelect);
