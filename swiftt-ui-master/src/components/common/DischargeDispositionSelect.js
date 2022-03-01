import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ dischargeDispositions, loading }) => ({
  dischargeDispositions,
  loading: loading.effects['dischargeDispositions/query']
}))
class DischargeDispositionSelect extends PureComponent {

  static defaultProps = {
    onDischargeDispositionSelect: () => {},
  };

  static propTypes = {
    dischargeDispositions: PropTypes.object,
    editValue: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    onDischargeDispositionSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.dischargeDispositionSearchHandler = debounce(this.dischargeDispositionSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'dischargeDispositions/query' });
  }

  dischargeDispositionSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'dischargeDispositions/query', payload: { name: value } }); }
  }

  handleDischargeDispositionSelectChange = (value, e) => {
    const { dischargeDispositions, onDischargeDispositionSelect } = this.props;
    const { list } = dischargeDispositions;

    onDischargeDispositionSelect(value ? list[value] : null);
  }

  render() {
    const { dischargeDispositions, editValue } = this.props;
    const { list, loading } = dischargeDispositions;

    return (
      <Select
        allowClear
        defaultValue={editValue}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Select discharge disposition"
        showSearch
        style={{ width: 300 }}
        onChange={this.handleDischargeDispositionSelectChange}
        onSearch={this.dischargeDispositionSearchHandler}
        filterOption={false}
      >
        {list.map((dischargeDisposition, index) => <Option key={index} value={index.toString()}>{dischargeDisposition.name}</Option>)}
      </Select>
    );
  }
}

function mapStateToProps({ dischargeDispositions }) {
  return { dischargeDispositions };
}

export default connect(mapStateToProps)(DischargeDispositionSelect);
