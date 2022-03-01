import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import numeral from 'numeral';

@connect(({ accountingPreferences }) => ({
  accountingPreferences
}))
class DetailedTotalAmountCard extends PureComponent {
  static defaultProps = {
    total: 0.00,
  };

  static propTypes = {
    currencyCode: PropTypes.string,
    discountAmount: PropTypes.number,
    subtotalAmount: PropTypes.number,
    taxableAmount: PropTypes.number,
    taxAmount: PropTypes.number,
    total: PropTypes.number,
  };

  componentDidMount() {
    const { dispatch, currencyCode, accountingPreferences } = this.props;

    if (currencyCode === undefined && accountingPreferences.data == undefined)
      this.props.dispatch({ type: 'accountingPreferences/query' });
  }

  render() {
    const {
      currencyCode,
      discountAmount,
      subtotalAmount,
      taxableAmount,
      taxAmount,
      total,
      accountingPreferences
    } = this.props;

    let currency = '';
    if (currencyCode === undefined && accountingPreferences.data.baseCurrency !== undefined) {
      currency = accountingPreferences.data.baseCurrency.code
    } else {
      currency = currencyCode;
    }

    return (
      <div style={{ fontWeight: 'bold', fontSize: '1em', textAlign: 'right' }}>
        {subtotalAmount !== undefined && (
          <Row gutter={24}>
            <Col span={16}>SubTotal</Col>
            <Col span={8}>{currency} {numeral(subtotalAmount).format('0,0.00')}</Col>
          </Row>
        )}
        {discountAmount !== undefined && (
          <Row gutter={24}>
            <Col span={16}>Discount</Col>
            <Col span={8}>{currency} -{numeral(discountAmount).format('0,0.00')}</Col>
          </Row>
        )}
        {taxableAmount !== undefined && (
          <Row>
            <Col span={16}>Taxable SubTotal: </Col>
            <Col span={8}>{currency} {numeral(taxableAmount).format('0,0.00')}</Col>
          </Row>
        )}
        {taxAmount !== undefined && (
          <Row gutter={24}>
            <Col span={16}>Tax</Col>
            <Col span={8}>{currency} {numeral(taxAmount).format('0,0.00')}</Col>
          </Row>
        )}
        <Row gutter={24}>
          <Col span={16}>Total</Col>
          <Col span={8}>{currency} {numeral(total).format('0,0.00')}</Col>
        </Row>
      </div>
    );
  }
}

export default DetailedTotalAmountCard;
