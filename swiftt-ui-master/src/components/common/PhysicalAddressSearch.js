import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

class PhysicalAddressSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.handleAddressSearch = debounce(this.handleAddressSearch, 1000);
  }

  handleAddressSearch = (value) => {
    // search and do autocomplete from google maps API
    console.log(value);
  }


  render() {
    return (<p>Physical address</p>);
  }
}

PhysicalAddressSearch.defaultProps = {};

PhysicalAddressSearch.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(PhysicalAddressSearch);
