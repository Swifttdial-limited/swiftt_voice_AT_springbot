import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Select, Spin } from 'antd';

const Option = Select.Option;

@connect(({ schemes, loading }) => ({
  schemes,
  loading: loading.effects['schemes/query'],
}))
class SchemeSelect extends PureComponent {
  
  static defaultProps = {
    multiSelect: false,
  };

  static propTypes = {
    multiSelect: PropTypes.bool.isRequired,
    schemes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    onSchemeSelect: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'schemes/query' });
  }

  handleSchemeSelectChange = (value, e) => {
    const { schemes, onSchemeSelect } = this.props;
    const { list } = schemes;
    onSchemeSelect(list[value]);
  }

  render() {
    const { multiSelect, schemes } = this.props;
    const { list, loading } = schemes;

    return (
      <Select
        allowClear
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder={multiSelect ? 'Select scheme(s)' : 'Select scheme'}
        style={{ width: 300 }}
        onChange={this.handleSchemeSelectChange}
        filterOption={false}
      >
        {list.map((scheme, index) => (
          <Option key={index} value={index.toString()}>
            {scheme.name}
          </Option>
))}
      </Select>
    );
  }
}

export default SchemeSelect;
