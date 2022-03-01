import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';

const Option = Select.Option;

class TitleSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.titleSearchHandler = debounce(this.titleSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'titles/query' });
  }

  titleSearchHandler = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'titles/query', payload: { searchQueryParam: value } }); }
  }

  handleTitleSelectChange = (value, e) => {
    const { titles, onTitleSelect } = this.props;
    const { list } = titles;

    onTitleSelect(value ? list[value] : null);
  }

  render() {
    const { titles, editValue } = this.props;
    const { list, loading } = titles;

    return (
      <Select
        allowClear
        defaultValue={editValue}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Select a title"
        showSearch
        style={{ width: 150 }}
        onChange={this.handleTitleSelectChange}
        onSearch={this.titleSearchHandler}
        filterOption={false}
      >
        {list.map((title, index) => <Option key={index} value={index.toString()}>{title.name}</Option>)}
      </Select>
    );
  }
}

TitleSelect.propTypes = {
  titles: PropTypes.object,
  editValue: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  onTitleSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ titles }) {
  return { titles };
}

export default connect(mapStateToProps)(TitleSelect);
