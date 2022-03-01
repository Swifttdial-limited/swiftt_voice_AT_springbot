import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PaymentWalletsList from './List';
import PaymentWalletModal from './Modal';
import PaymentWalletToolbar from './Toolbar';

@connect(({ paymentWallets, loading }) => ({
  paymentWallets,
  loading: loading.effects['paymentWallets/query']
}))
class PaymentWalletsView extends PureComponent {

  static propTypes = {
    patientProfile: PropTypes.object.isRequired,
    paymentWallets: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch, patientProfile } = this.props;
    dispatch({ type: 'paymentWallets/purge' });
    dispatch({ type: 'paymentWallets/query', payload: { patientId: patientProfile.id } });
  }
  componentWillReceiveProps(nextProps) {
    if ('patientProfile' in nextProps) {
      if (nextProps.patientProfile.id !== this.props.patientProfile.id) {
        const { dispatch } = this.props;
        dispatch({ type: 'paymentWallets/query', payload: { patientId: nextProps.patientProfile.id } });
      }
    }
  }

  render() {
    const { dispatch, paymentWallets, patientProfile } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType } = paymentWallets;

    const paymentWalletModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(values) {
        values.patientId = patientProfile.id;

        delete values.paymentType;

        dispatch({ type: `paymentWallets/${modalType}`, payload: values });
      },
      onCancel() {
        dispatch({ type: 'paymentWallets/hideModal' });
      },
    };

    const paymentWalletListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {},
      onDeleteItem(id) {
        dispatch({ type: 'paymentWallets/delete', payload: { walletId: id, patientId: patientProfile.id } });
      },
      onEditItem(item) {
        dispatch({
          type: 'paymentWallets/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
      onActivateItem(id) {
        dispatch({ type: 'paymentWallets/activate', payload: { walletId: id, patientId: patientProfile.id } });
      },
      onDeactivateItem(id) {
        dispatch({ type: 'paymentWallets/deactivate', payload: { walletId: id, patientId: patientProfile.id } });
      }
    };

    const paymentWalletToolbarProps = {
      onAdd() {
        dispatch({
          type: 'paymentWallets/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const PaymentWalletModalGen = () => <PaymentWalletModal {...paymentWalletModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <PaymentWalletToolbar {...paymentWalletToolbarProps} />
          <PaymentWalletsList {...paymentWalletListProps} />
          <PaymentWalletModalGen />
        </Col>
      </Row>
    );
  }
}

export default PaymentWalletsView;
