import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Select, Spin } from 'antd';

const Option = Select.Option;

class PurchaseItemSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.purchaseItemSearchHandler = debounce(this.purchaseItemSearchHandler, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'purchaseItems/purge' });
  }

  purchaseItemSearchHandler = (value) => {
    const { dispatch, contextType, context } = this.props;

    if (value.length > 2) { dispatch({ type: 'purchaseItems/query', payload: { searchQueryParam: value } }); }
  }

  purchaseItemSelectChangeHandler = (value, e) => {
    const { purchaseItems, onPurchaseItemSelect } = this.props;
    const { list } = purchaseItems;

    onPurchaseItemSelect(value ? list[value] : null);
  }

  render() {
    const { purchaseItems, editValue } = this.props;
    const { list, loading } = purchaseItems;

    return (
      <Select
        allowClear
        defaultValue={editValue}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Search product"
        showSearch
        style={{ width: 300 }}
        onChange={this.purchaseItemSelectChangeHandler}
        onSearch={this.purchaseItemSearchHandler}
        filterOption={false}
      >
        {list.map((purchaseItem, index) => <Option key={index} value={index.toString()}>{purchaseItem.product.productName}</Option>)}
      </Select>
    );
  }
}

PurchaseItemSelect.propTypes = {
  purchaseItems: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editValue: PropTypes.string,
  onPurchaseItemSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ purchaseItems }) {
  return { purchaseItems };
}

export default connect(mapStateToProps)(PurchaseItemSelect);
