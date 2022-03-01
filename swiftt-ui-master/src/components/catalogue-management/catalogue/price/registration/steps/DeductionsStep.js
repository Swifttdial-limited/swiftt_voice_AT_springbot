import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PriceDeductionsView from '../../deductions';

@connect(({ catalogue_prices, loading }) => ({
  catalogue_prices,
  loading: loading.effects['catalogue_prices/query'],
}))
class PriceDeductionsDefinitionForm extends PureComponent {

  static defaultProps = {
    loading: false,
    catalogue_prices: {},
  };

  static propTypes = {
    loading: PropTypes.bool,
    catalogue_prices: PropTypes.object.isRequired,
  };

  render() {
    const { loading, catalogue_prices } = this.props;
    const { currentItem } = catalogue_prices;

    const priceDeductionsProp = {
      loadData: false,
      priceProfile: currentItem,
    };

    return (
      <div style={{ padding: 20 }}>
        { currentItem.id ? <PriceDeductionsView {...priceDeductionsProp} /> : <Card loading={loading} /> }
      </div>
    );
  }
}

export default PriceDeductionsDefinitionForm;
