import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import GoodsReturnForm from '../../../../components/inventory-management/goods-return/Form';

@connect(({ accountingPreferences, goodsReturn, loading }) => ({
  accountingPreferences,
  goodsReturn,
  loading: loading.effects['goodsReturn/query']
}))
class GoodsReturnRegistrationView extends PureComponent {
  static propTypes = {
    goodsReturn: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { accountingPreferences, dispatch, location } = this.props;
    const match = pathToRegexp('/inventory/goods-return/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'goodsReturn/query', payload: { id: match[1] } });

      if (accountingPreferences.data.baseCurrency == undefined)
        this.props.dispatch({ type: 'accountingPreferences/query' });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'goodsReturn/purge' });
  }

  render() {
    const { dispatch, goodsReturn } = this.props;
    const { data } = goodsReturn;

    const goodsReturnFormProps = {
      goodsReturn: data,
      onCreate(data) {
        dispatch({ type: 'goodsReturn/create', payload: { id: data.receiptNote.id, payload: data } });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'goodsReturn/createAndSubmit', payload: { id: data.receiptNote.id, payload: data } });
      },
    };

    return (
      <PageHeaderLayout
        title="New Goods Return"
      >
        <div className="content-inner">
          <GoodsReturnForm {...goodsReturnFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default GoodsReturnRegistrationView;
