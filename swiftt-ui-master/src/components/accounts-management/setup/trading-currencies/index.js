import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import merge from 'lodash/merge';

import CurrencyList from './List';
import CurrencySearch from './Search';
import CurrencyModal from './Modal';

@connect(({ tradingCurrencies, loading }) => ({
  tradingCurrencies,
  loading: loading.effects['tradingCurrencies/query'],
}))
class TradingCurrenciesView extends PureComponent {

  static propTypes = {
    tradingCurrencies: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tradingCurrencies/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tradingCurrencies/purge' });
  }

  render() {
    const { dispatch, tradingCurrencies } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = tradingCurrencies;

    const currencyModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `tradingCurrencies/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'tradingCurrencies/hideModal' });
      },
    };

    const currencyListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'tradingCurrencies/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'tradingCurrencies/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'tradingCurrencies/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const currencySearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'tradingCurrencies/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'tradingCurrencies/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const CurrencyModalGen = () => <CurrencyModal {...currencyModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <CurrencySearch {...currencySearchProps} />
            <CurrencyList {...currencyListProps} />
            <CurrencyModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TradingCurrenciesView;
