import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Input } from 'antd';
import numeral from 'numeral';

import {
  queryDetailed,
  querySummarized,
} from '../../../services/inventory/inventoryBalances';

import NumberInfo from '../../NumberInfo';

class InventoryBalanceAndCostInput extends PureComponent {
  static defaultProps = {
    detailed: false,
  };

  static propTypes = {
    detailed: PropTypes.bool,
    location: PropTypes.string,
    product: PropTypes.string,
    text: PropTypes.string,
  };

  state = {
    balances: [],
  };

  componentDidMount() {
    this.getStocks();
  }

  componentDidUpdate(prevProps) {
    const { location, product } = this.props;
    if (location !== prevProps.location || product !== prevProps.product) {
      this.getStocks();
    }
  }

  getStocks = () => {
    const { detailed, location, product } = this.props;
    if (location && product) {
      if(detailed) {
        queryDetailed({
          location,
          product
        }).then((response) => {
          this.setState({ balances: response.content });
        }).catch((e) => {
          this.setState({ balances: [] });
        });
      } else {
        querySummarized({
          location,
          product
        })
        .then((response) => {
          this.setState({ balances: response.content });
        }).catch((e) => {
          this.setState({ balances: [] });
        });
      }
    }
  }

  render() {
    const { balances } = this.state;
    const { type } = this.props;

    return (
      <div>
        {balances.length > 0 ? type === 'text' ? (
          <span><strong>Balance: </strong>{numeral(balances[0].balance).format('0,0')}</span>
        ) : (
            <NumberInfo gap={2} subTitle="Balance" total={numeral(balances[0].balance).format('0,0.00')} />
          ) : (
            <span>-</span>
          )}
      </div>
    );
  }
}

export default InventoryBalanceAndCostInput;
