import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class AdministrationRouteSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.handleAdministrationRouteSearch = debounce(this.handleAdministrationRouteSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_administrationroutes/query' });
  }

  handleAdministrationRouteSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'catalogue_administrationroutes/query', payload: { searchQueryParam: value } }); }
  }

  handleAdministrationRouteSelectChange = (value, e) => {
    const { catalogue_administrationroutes, onAdministrationRouteSelect, multiSelect } = this.props;
    const { list } = catalogue_administrationroutes;

    if (!multiSelect) { onAdministrationRouteSelect(list[value]); } else { onAdministrationRouteSelect(this.mapSelectedValueToObject(value)); }
  }

  handleBlur = () => {}

  mapSelectedValueToObject = (value) => {
    const { catalogue_administrationroutes } = this.props;
    const { list } = catalogue_administrationroutes;

    const selectedAdministrationRoutes = [];
    value.forEach((itemIndex) => {
      selectedAdministrationRoutes.push(list[itemIndex]);
    });

    return selectedAdministrationRoutes;
  }

  render() {
    const { catalogue_administrationroutes, multiSelect, editValue } = this.props;
    const { list, loading } = catalogue_administrationroutes;

    const selectProps = {};
    if (editValue) { selectProps.defaultValue = editValue; }

    return (
      <Select
        allowClear
        {...selectProps}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No administration route matching search criteria found'}
        placeholder={multiSelect ? 'Select administration route(s)' : 'Select administration route'}
        showSearch
        style={{ width: 300 }}
        onChange={this.handleAdministrationRouteSelectChange}
        onSearch={this.handleAdministrationRouteSearch}
        filterOption={false}
      >
        {list.map((administrationRoute, index) => <Option key={index} value={index.toString()}>{administrationRoute.routeName}</Option>)}
      </Select>
    );
  }
}

AdministrationRouteSelect.propTypes = {
  catalogue_administrationroutes: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  multiSelect: PropTypes.bool.isRequired,
  onAdministrationRouteSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ catalogue_administrationroutes }) {
  return { catalogue_administrationroutes };
}

export default connect(mapStateToProps)(AdministrationRouteSelect);
