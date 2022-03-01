import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import WalletTypeList from './List';
import WalletTypeSearch from './Search';
import WalletTypeModal from './Modal';

@connect(({ walletTypes }) => ({
  walletTypes,
}))
class WalletTypesView extends PureComponent {

  static propTypes = {
    walletTypes: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'walletTypes/query' });
  }

  render() {
    const { dispatch, walletTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = walletTypes;

    const walletTypeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `walletTypes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'walletTypes/hideModal' });
      },
    };

    const walletTypeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'walletTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'walletTypes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'walletTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const walletTypeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'walletTypes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'walletTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const WalletTypeModalGen = () => <WalletTypeModal {...walletTypeModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <WalletTypeSearch {...walletTypeSearchProps} />
            <WalletTypeList {...walletTypeListProps} />
            <WalletTypeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default WalletTypesView;
