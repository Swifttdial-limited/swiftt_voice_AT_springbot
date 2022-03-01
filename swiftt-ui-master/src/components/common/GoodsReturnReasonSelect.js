import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/inventory/goodsReturnReasons';

const Option = Select.Option;

class GoodsReturnReasonSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.any,
    multiSelect: PropTypes.bool.isRequired,
    onGoodsReturnReasonSelect: PropTypes.func.isRequired,
  };

  state = {
    goodsReturnReasons: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.goodsReturnReasonSearchHandler = debounce(this.goodsReturnReasonSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchGoodsReturnReasons();
  }

  goodsReturnReasonSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchGoodsReturnReasons(value);
    }
  }

  fetchGoodsReturnReasons = (searchQueryParam) => {
    const { goodsReturnReason } = this.props;

    this.setState({ loading: true });

    query({
      ...(searchQueryParam != undefined && { goodsReturnReasonName: searchQueryParam })
    }).then((response) => {
      this.setState({ goodsReturnReasons: response.content, loading: false });
    }).catch((e) => {
      this.setState({ goodsReturnReasons: [], loading: false });
    });;
  }

  handleGoodsReturnReasonSelectChange = (value, e) => {
    const { multiSelect, onGoodsReturnReasonSelect } = this.props;

    if (!multiSelect) {
      onGoodsReturnReasonSelect(this.mapSelectedValueToGoodsReturnReason(value));
    } else {
      onGoodsReturnReasonSelect(this.mapSelectedValuesToGoodsReturnReason(value));
    }
  }

  mapSelectedValueToGoodsReturnReason = (selectedGoodsReturnReason) => {
    const { goodsReturnReasons } = this.state;
    return find(goodsReturnReasons, { id: selectedGoodsReturnReason.key});
  }

  mapSelectedValuesToGoodsReturnReason = (values) => {
    const { goodsReturnReasons } = this.state;

    const selectedGoodsReturnReasons = [];
    values.forEach((selectedGoodsReturnReason) => {
      selectedGoodsReturnReasons.push({ code: selectedGoodsReturnReason.label, id: selectedGoodsReturnReason.key });
    })

    return selectedGoodsReturnReasons;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { goodsReturnReasons, loading } = this.state;

    const generateLabel = (goodsReturnReason) =>
      Object.assign({}, { key: goodsReturnReason.id, label: goodsReturnReason.code });

    const generateGoodsReturnReasonTokens = (accs) => map(accs, (goodsReturnReason) => {
      return generateLabel(goodsReturnReason);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateGoodsReturnReasonTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select goods return reason(s)' : 'Select goods return reason'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No goods return reason matching search criteria found'}
        onChange={this.handleGoodsReturnReasonSelectChange}
        onSearch={this.goodsReturnReasonSearchHandler}
        filterOption={false}>
        {goodsReturnReasons.map((goodsReturnReason, index) => <Option key={index} value={goodsReturnReason.id}>{generateLabel(goodsReturnReason).label}</Option>)}
      </Select>
    );
  }
}

export default GoodsReturnReasonSelect;
