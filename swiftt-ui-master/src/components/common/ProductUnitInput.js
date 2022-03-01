import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Input, InputNumber, Row, Col } from 'antd';

import UnitOfMeasureSelect from './UnitOfMeasureSelect';

class ProductUnitInput extends PureComponent {
  state = {
    packSize: null,
    unitOfMeasure: null,
    unitOfMeasureSelectDisabled: true,
  }

  handleUnitOfMeasureSelectChange = (value) => {
    this.props.onProductUnitInput({
      packSize: this.state.packSize,
      unitOfMeasure: value,
    });
  }

  packSizeInputChangeHandler = (value) => {
    this.props.onProductUnitInput({
      packSize: value,
      unitOfMeasure: this.state.unitOfMeasure,
    });
  }

  render() {
    const { unitOfMeasureSelectDisabled } = this.state;
    const { editValue } = this.props;

    const packSizeProps = {};
    const unitOfMeasureSelectProps = {
      disabled: unitOfMeasureSelectDisabled,
    };

    if (editValue) {
      packSizeProps.defaultValue = editValue.packSize;
      unitOfMeasureSelectProps.editValue = editValue.unitOfMeasure.name;
    }

    return (
      <Row gutter={8}>
        <Col span={6}>
          <InputNumber
            placeholder="Pack Size"
            style={{ width: '100%' }}
            min={1}
            {...packSizeProps}
            onChange={this.packSizeInputChangeHandler}
          />
        </Col>
        <Col span={12}>
          <UnitOfMeasureSelect
            {...unitOfMeasureSelectProps}
            onUnitOfMeasureSelect={this.handleUnitOfMeasureSelectChange}
          />
        </Col>
      </Row>
    );
  }
}

ProductUnitInput.propTypes = {
  editValue: PropTypes.object,
  onProductUnitInput: PropTypes.func.isRequired,
};

export default ProductUnitInput;
