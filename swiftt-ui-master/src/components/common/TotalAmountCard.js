import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import numeral from 'numeral';

@connect(({ accountingPreferences }) => ({
  accountingPreferences
}))
class TotalAmountCard extends PureComponent {

  static defaultProps = {
    amount: '0.00',
  };

  static propTypes = {
    description: PropTypes.string.isRequired,
    currencyCode: PropTypes.string,
    amount: PropTypes.number,
    rate: PropTypes.number,
  };

  componentDidMount() {
    const { dispatch, currencyCode, accountingPreferences } = this.props;

    if (currencyCode === undefined && accountingPreferences.data.id === undefined)
      this.props.dispatch({ type: 'accountingPreferences/query' });
  }

  render() {
    const {
      description,
      currencyCode,
      amount,
      rate,
      accountingPreferences
    } = this.props;

    let currency = '';
    if (currencyCode === undefined && accountingPreferences.data.id !== undefined) {
      currency = accountingPreferences.data.baseCurrency.code
    } else {
      currency = currencyCode;
    }

    return (
      <div style={{ fontWeight: '900 !important', textAlign: 'right' }}>
        <Row>
          <Col>
            <h1>{description}</h1>
          </Col>
          <Col>
            <h1>{currency} &nbsp; {numeral(amount).format('0,0.00')}</h1>
          </Col>
        </Row>
        { currencyCode && (<p>Rate: 1 {currencyCode} = {rate} {accountingPreferences.data.baseCurrency.code} </p>)}
      </div>
    );
  }
}

export default TotalAmountCard;
