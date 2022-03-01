import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { filter, forEach, map, orderBy, uniq } from 'lodash';
import { Cascader } from 'antd';

class LocationCascader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { locationCount: 0, options: [] };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'locations/query' });
  }

  onChange = (value, selectedOptions) => {
    const { locations, onLocationSelect } = this.props;
    const { list } = locations;

    if (selectedOptions.length == 2) {
      const location = filter(list, ['id', selectedOptions[selectedOptions.length - 1].value])[0];
      onLocationSelect(location || null);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locations.list.length != this.state.locationCount) { this.generateLocationOptions(nextProps.locations.list); }
  }

  generateLocationOptions = (list) => {
    this.setState({ locationCount: list.length });
    orderBy(
      map(
        uniq(
          map(list, location => JSON.stringify(location.locationType))
        ),
        locationType => JSON.parse(locationType)
      ),
      ['name'], ['asc']
    ).forEach(locationType => this.state.options.push(
      { value: locationType.publicId, label: locationType.name, isLeaf: false }
    ));

    this.setState({ options: [...this.state.options] });
  }

  loadData = (selectedOptions) => {
    const { locations } = this.props;
    const { list } = locations;

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.children = [];

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;

      filter(list, ['locationType.publicId', targetOption.value]).forEach((location) => {
        targetOption.children.push({
          label: location.name,
          value: location.id,
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
        notFoundContent="Oops! No location types defined"
        placeholder="Select location type and location"
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}

LocationCascader.propTypes = {
  locations: PropTypes.object,
  onLocationSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ locations }) {
  return { locations };
}

export default connect(mapStateToProps)(LocationCascader);
