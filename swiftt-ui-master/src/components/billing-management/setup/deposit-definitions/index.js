import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import List from './List';
import Search from './Search';
import Modal from './Modal';

@connect(({ depositDefinitions, loading }) => ({
  depositDefinitions,
  loading: loading.effects['depositDefinitions/query'],
}))
class DepositDefinitionView extends PureComponent {

  static propTypes = {
    depositDefinitions: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'depositDefinitions/query' });
  }

  render() {
    const { dispatch, depositDefinitions } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = depositDefinitions;

    const depositDefinitionModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `depositDefinitions/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'depositDefinitions/hideModal' });
      },
    };

    const depositDefinitionListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'depositDefinitions/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'depositDefinitions/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'depositDefinitions/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const depositDefinitionSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'depositDefinitions/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'depositDefinitions/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ModalGen = () => <Modal {...depositDefinitionModalProps} />;

    return (
      <div>
        <Row>
          <Col xs={24} md={24} lg={24}>
            <Search {...depositDefinitionSearchProps} />
            <List {...depositDefinitionListProps} />
          </Col>
        </Row>
        <ModalGen />
      </div>
    );
  }
}

export default DepositDefinitionView;
