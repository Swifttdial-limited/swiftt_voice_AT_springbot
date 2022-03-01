import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';

const Option = Select.Option;

class ActiveIngredientSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.handleActiveIngredientSearch = debounce(this.handleActiveIngredientSearch, 1000);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_activeingredients/query' });
  }

  handleActiveIngredientSearch = (value) => {
    const { dispatch } = this.props;

    if (value.length > 2) { dispatch({ type: 'catalogue_activeingredients/query', payload: { searchQueryParam: value } }); }
  }

  handleActiveIngredientSelectChange = (value, e) => {
    const { catalogue_activeingredients, onActiveIngredientSelect, multiSelect } = this.props;
    const { list } = catalogue_activeingredients;

    if (!multiSelect) { onActiveIngredientSelect(list[value]); } else { onActiveIngredientSelect(this.mapSelectedValueToObject(value)); }
  }

  mapSelectedValueToObject = (value) => {
    const { catalogue_activeingredients } = this.props;
    const { list } = catalogue_activeingredients;

    const selectedActiveIngredients = [];
    value.forEach((itemIndex) => {
      selectedActiveIngredients.push(list[itemIndex]);
    });

    return selectedActiveIngredients;
  }

  render() {
    const { catalogue_activeingredients, multiSelect } = this.props;
    const { list, loading } = catalogue_activeingredients;

    return (
      <Select
        allowClear
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder={multiSelect ? 'Select active ingredient(s)' : 'Select active ingredient'}
        mode={multiSelect ? 'multiple' : ''}
        showSearch
        style={{ width: 300 }}
        onChange={this.handleActiveIngredientSelectChange}
        onSearch={this.handleActiveIngredientSearch}
        filterOption={false}
      >
        {list.map((activeIngredient, index) => <Option key={index} value={index.toString()}>{activeIngredient.activeIngredientName}</Option>)}
      </Select>
    );
  }
}

ActiveIngredientSelect.propTypes = {
  catalogue_activeingredients: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  multiSelect: PropTypes.bool.isRequired,
  onActiveIngredientSelect: PropTypes.func.isRequired,
};

function mapStateToProps({ catalogue_activeingredients }) {
  return { catalogue_activeingredients };
}

export default connect(mapStateToProps)(ActiveIngredientSelect);
