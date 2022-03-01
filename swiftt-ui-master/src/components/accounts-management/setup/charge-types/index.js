import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import ChargeTypeList from './List';
import ChargeTypeModal from './Modal';
import ChargeTypeSearch from './Search';

@connect(({ chargeTypes, loading }) => ({
  chargeTypes,
  loading: loading.effects['chargeTypes/query'],
}))
class ChargeTypesView extends PureComponent {
  static defaultProps = {
    chargeTypes: {},
  };

  static propTypes = {
    chargeTypes: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'chargeTypes/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'chargeTypes/purge' });
  }

  render() {
    const { dispatch, chargeTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = chargeTypes;

    const chargeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `chargeTypes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'chargeTypes/hideModal' });
      },
    };

    const chargeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'chargeTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'chargeTypes/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'chargeTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const chargeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.searchQueryParam = fieldsValue.keyword; }
        }

        dispatch({ type: 'chargeTypes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'chargeTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ChargeTypeModalGen = () => <ChargeTypeModal {...chargeModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <ChargeTypeSearch {...chargeSearchProps} />
            <ChargeTypeList {...chargeListProps} />

            <ChargeTypeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChargeTypesView;
