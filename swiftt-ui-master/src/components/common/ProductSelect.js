import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/catalogue/products';

const { Option } = Select;

class ProductSelect extends PureComponent {
  static defaultProps = {
    autoLoad: true,
    disabled: false,
    multiSelect: false,
    onProductSelect: () => {},
    productTypes: [],
    size: 10,
    style: {
      minWidth: '200px',
    },
  }

  static propTypes = {
    editValue: PropTypes.string,
    activated: PropTypes.bool,
    autoLoad: PropTypes.bool,
    disabled: PropTypes.bool,
    multiSelect: PropTypes.bool.isRequired,
    onProductSelect: PropTypes.func.isRequired,
    productType: PropTypes.string,
    productTypes: PropTypes.array,
    size: PropTypes.number,
    style: PropTypes.object,
    trackable: PropTypes.bool,
  };

  state = {
    products: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.productSearchHandler = debounce(this.productSearchHandler, 1000);
  }

  componentDidMount() {
    const {
      autoLoad
    } = this.props;

    if (autoLoad)
      this.fetchProducts();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editValue && prevState.products.length == 0) {
      return {
        products: nextProps.multiSelect ? nextProps.editValue : [nextProps.editValue],
      }
    }

    return null;
  }

  productSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchProducts(value);
    }
  }

  fetchProducts = (searchQueryParam) => {
    const {
      activated,
      productTypes,
      size,
      trackable,
    } = this.props;

    this.setState({ loading: true });

    query({
      ...(activated && { activated: true }),
      ...(trackable && { trackable: true }),
      ...(productTypes != undefined && { productType: productTypes }),
      ...(searchQueryParam != undefined && { searchQueryParam: searchQueryParam }),
      size: size,
    }).then((response) => {
      this.setState({ products: response.content, loading: false });
    }).catch((e) => {
      this.setState({ products: [], loading: false });
    });
  }

  productSelectChangeHandler = (value, e) => {
    const { multiSelect, onProductSelect } = this.props;

    if (!multiSelect) {
      onProductSelect(this.mapSelectedValueToProduct(value));
    } else {
      onProductSelect(this.mapSelectedValuesToProduct(value));
    }
  }

  mapSelectedValueToProduct = (selectedProduct) => {
    const { products } = this.state;

    if(selectedProduct)
      return find(products, { id: selectedProduct.key});
  }

  mapSelectedValuesToProduct = (values) => {
    const { products } = this.state;

    const selectedProducts = [];
    values.forEach((selectedProduct) => {
      selectedProducts.push({ productName: selectedProduct.label, id: selectedProduct.key });
    })

    return selectedProducts;
  }

  generateProductTokens = (products) => map(products, (product) => {
    return this.generateLabel(product);
  });

  generateLabel = (product) => {
    console.log(product)
    return {
      key: product.id,
      label: product.productName,
    };
  }

  render() {
    const { disabled, editValue, multiSelect, style } = this.props;
    const { products, loading } = this.state;

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = this.generateProductTokens(editValue);
      else selectProps.defaultValue = this.generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        style={{...style}}
        allowClear
        disabled={disabled}
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select Product(s)' : 'Select Product'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No product matching search criteria found'}
        onChange={this.productSelectChangeHandler}
        onSearch={this.productSearchHandler}
        filterOption={false}>
        {products.map((product, index) => <Option key={index} value={product.id}>{this.generateLabel(product).label}</Option>)}
      </Select>
    );
  }
}

export default ProductSelect;
