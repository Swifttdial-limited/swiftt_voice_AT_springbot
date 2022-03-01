import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PaymentTermList from './List';
import PaymentTermSearch from './Search';
import PaymentTermModal from './Modal';

@connect(({ paymentTerms, loading }) => ({
  paymentTerms,
  loading: loading.effects['paymentTerms/query'],
}))
class PaymentTermCategoriesView extends PureComponent {
  static propTypes = {
    paymentTerms: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'paymentTerms/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'paymentTerms/purge' });
  }

  render() {
    const { dispatch, paymentTerms } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = paymentTerms;

    const vendorModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `paymentTerms/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'paymentTerms/hideModal' });
      },
    };

    const vendorListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'paymentTerms/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'paymentTerms/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'paymentTerms/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const vendorSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'paymentTerms/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'paymentTerms/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const PaymentTermModalGen = () => <PaymentTermModal {...vendorModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <PaymentTermSearch {...vendorSearchProps} />
            <PaymentTermList {...vendorListProps} />

            <PaymentTermModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default PaymentTermCategoriesView;
