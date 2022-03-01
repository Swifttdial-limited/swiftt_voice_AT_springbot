import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/locations';

const { Option } = Select;

class LocationSelect extends PureComponent {
  static defaultProps = {
    departmental: false,
    isStore: false,
    isTheatre: false,
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.any,
    department: PropTypes.string,
    departmental: PropTypes.bool,
    isStore: PropTypes.bool,
    isTheatre: PropTypes.bool,
    parentLocation: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onLocationSelect: PropTypes.func.isRequired,
  };

  state = {
    locations: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.locationSearchHandler = debounce(this.locationSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchLocations();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editValue && prevState.locations.length == 0) {
      return {
        locations: nextProps.multiSelect ? nextProps.editValue : [nextProps.editValue],
      }
    }

    return null;
  }

  locationSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchLocations(value);
    }
  }

  fetchLocations = (searchQueryParam) => {
    const {
      department,
      departmental,
      isStore,
      isTheatre,
      parentLocation
    } = this.props;

    this.setState({ loading: true });

    query({
      ...(isStore && { isStore: true }),
      ...(isTheatre && { isTheatre: true }),
      ...(department != undefined && { department: department }),
      ...(departmental && { departmental: true }),
      ...(parentLocation != undefined && { parentLocation: parentLocation }),
      ...(searchQueryParam != undefined && { name: searchQueryParam }),
      size: 1000,
    }).then((response) => {
      this.setState({ locations: response.content, loading: false });
    }).catch((e) => {
      this.setState({ locations: [], loading: false });
    });
  }

  handleLocationSelectChange = (value, e) => {
    const { multiSelect, onLocationSelect } = this.props;

    if (!multiSelect) {
      onLocationSelect(this.mapSelectedValueToLocation(value));
    } else {
      onLocationSelect(this.mapSelectedValuesToLocation(value));
    }
  }

  mapSelectedValueToLocation = (selectedLocation) => {
    const { locations } = this.state;

    if(selectedLocation)
      return find(locations, { publicId: selectedLocation.key});
  }

  mapSelectedValuesToLocation = (values) => {
    const { locations } = this.state;

    const selectedLocations = [];
    values.forEach((selectedLocation) => {
      selectedLocations.push({ name: selectedLocation.label, publicId: selectedLocation.key });
    })

    return selectedLocations;
  }

  generateLocationTokens = (locations) => map(locations, (location) => {
    return this.generateLabel(location);
  });

  generateLabel = (location) => {
    return {
      key: location.publicId,
      label: location.name,
    };
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { locations, loading } = this.state;

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = this.generateLocationTokens(editValue);
      else selectProps.defaultValue = this.generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        style={{...style}}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select Location(s)' : 'Select Location'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No location matching search criteria found'}
        onChange={this.handleLocationSelectChange}
        onSearch={this.locationSearchHandler}
        filterOption={false}>
        {locations.map((location, index) => <Option key={index} value={location.publicId}>{this.generateLabel(location).label}</Option>)}
      </Select>
    );
  }
}

export default LocationSelect;
