import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/locationTypes';

const Option = Select.Option;

class LocationTypeSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onLocationTypeSelect: PropTypes.func.isRequired,
  };

  state = {
    locationTypes: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.locationTypeSearchHandler = debounce(this.locationTypeSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchLocationTypes();
  }

  locationTypeSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchLocationTypes(value);
    }
  }

  fetchLocationTypes = (searchQueryParam) => {
    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { name: searchQueryParam })
    }).then((response) => {
      this.setState({ locationTypes: response.content, loading: false });
    }).catch((e) => {
      this.setState({ locationTypes: [], loading: false });
    });;
  }

  handleLocationTypeSelectChange = (value, e) => {
    const { multiSelect, onLocationTypeSelect } = this.props;

    if (!multiSelect) {
      onLocationTypeSelect(this.mapSelectedValueToLocationType(value));
    } else {
      onLocationTypeSelect(this.mapSelectedValuesToLocationType(value));
    }
  }

  mapSelectedValueToLocationType = (selectedLocationType) => {
    const { locationTypes } = this.state;
    return find(locationTypes, { publicId: selectedLocationType.key});
  }

  mapSelectedValuesToLocationType = (values) => {
    const { locationTypes } = this.state;

    const selectedLocationTypes = [];
    values.forEach((selectedLocationType) => {
      locationTypes.forEach((locationType) => {
        if(locationType.publicId === selectedLocationType.key) {
          selectedLocationTypes.push({
            id: locationType.id,
            version: locationType.version,
            name: selectedLocationType.label,
            publicId: selectedLocationType.key
          });
        }
      });
    })

    return selectedLocationTypes;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { locationTypes, loading } = this.state;

    const generateLabel = (locationType) =>
      Object.assign({}, { key: locationType.publicId, label: locationType.name });

    const generateLocationTypeTokens = (accs) => map(accs, (locationType) => {
      return generateLabel(locationType);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateLocationTypeTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select location type(s)' : 'Select location type'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No location type matching search criteria found'}
        onChange={this.handleLocationTypeSelectChange}
        onSearch={this.locationTypeSearchHandler}
        filterOption={false}>
        {locationTypes.map((locationType, index) => <Option key={index} value={locationType.publicId}>{generateLabel(locationType).label}</Option>)}
      </Select>
    );
  }
}

export default LocationTypeSelect;
