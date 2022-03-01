import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { filter, forEach, map, orderBy, uniq } from 'lodash';
import { Cascader } from 'antd';

@connect(({ beds, loading }) => ({
  beds,
  loading: loading.effects['beds/query'],
}))
class BedCascader extends PureComponent {

  static defaultProps = {
    filterByUnoccupied: false,
  };

  static propTypes = {
    beds: PropTypes.object,
    onBedSelect: PropTypes.func.isRequired,
    filterByUnoccupied: PropTypes.bool,
  };

  state = { bedCount: 0, options: [] };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'beds/query', payload: { size: 1000 } });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.beds.list.length != this.state.bedCount) { this.generateBedOptions(nextProps.beds.list); }
  }

  onChange = (value, selectedOptions) => {
    const { beds, onBedSelect } = this.props;
    const { list } = beds;

    if (selectedOptions.length == 2) {
      const bed = filter(list, ['id', selectedOptions[selectedOptions.length - 1].value])[0];
      onBedSelect(bed || null);
    }
  }

  generateBedOptions = (list) => {
    const { filterByUnoccupied } = this.props;

    let beds = [];

    if (filterByUnoccupied) {
      beds = filter(list, function(bed) {
        return bed.currentBedOccupation === undefined
      });
    } else {
      beds = list;
    }

    this.setState({ bedCount: beds.length });
    orderBy(
      map(
        uniq(
          map(beds, bed => JSON.stringify(bed.ward))
        ),
        ward => JSON.parse(ward)
      ),
      ['name'], ['asc']
    ).forEach(ward => this.state.options.push(
      { value: ward.publicId, label: ward.name, isLeaf: false }
    ));

    this.setState({ options: [...this.state.options] });
  }

  loadData = (selectedOptions) => {
    const { beds } = this.props;
    const { list } = beds;

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.children = [];

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;

      filter(list, ['ward.publicId', targetOption.value]).forEach((bed) => {
        targetOption.children.push({
          label: bed.name,
          value: bed.id,
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
        notFoundContent="Oops! No wards defined"
        placeholder="Select ward and bed"
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}

export default BedCascader;
