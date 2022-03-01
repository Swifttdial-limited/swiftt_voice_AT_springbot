import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import JsBarcode from 'jsbarcode';

class BarcodeCanvas extends PureComponent {
  static defaultProps = {
    validate: false,
  };

  static propTypes = {
    characters: PropTypes.string.isRequired,
    validate: PropTypes.bool,
  };

  componentDidMount() {
    const { validate, characters } = this.props;

    if (validate) {
      JsBarcode('#barcode')
        .EAN13(characters, { height: 35, fontSize: 15, textMargin: 0 })
        .render();
    } else {
      JsBarcode('#barcode', characters)
        .render();
    }
  }

  render() {
    return (
      <svg id="barcode" height="112px" xHeight={112} />
    );
  }
}

export default BarcodeCanvas;
