import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PaymentModeList from './List';
import PaymentModeSearch from './Search';
import PaymentModeModal from './Modal';

@connect(({ paymentModes, loading }) => ({
  paymentModes,
  loading: loading.effects['paymentModes/query'],
}))
class PaymentModesView extends PureComponent {

  static propTypes = {
    paymentModes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'paymentModes/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'paymentModes/purge' });
  }

  render() {
    const { dispatch, paymentModes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = paymentModes;

    const paymentModeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `paymentModes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'paymentModes/hideModal' });
      },
    };

    const paymentModeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'paymentModes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'paymentModes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'paymentModes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const paymentModeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'paymentModes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'paymentModes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const PaymentModeModalGen = () => <PaymentModeModal {...paymentModeModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <PaymentModeSearch {...paymentModeSearchProps} />
            <PaymentModeList {...paymentModeListProps} />

            <PaymentModeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default PaymentModesView;
