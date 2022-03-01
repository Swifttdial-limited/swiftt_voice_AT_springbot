import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import TaxTypeList from './List';
import TaxTypeSearch from './Search';
import TaxTypeModal from './Modal';

@connect(({ taxTypes, loading }) => ({
  taxTypes,
  loading: loading.effects['taxTypes/query'],
}))
class TaxTypesView extends PureComponent {
  static propTypes = {
    taxTypes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'taxTypes/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'taxTypes/purge' });
  }

  render() {
    const { dispatch, taxTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = taxTypes;

    const taxTypeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `taxTypes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'taxTypes/hideModal' });
      },
    };

    const taxTypeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'taxTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'taxTypes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'taxTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const taxTypeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'taxTypes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'taxTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const TaxTypeModalGen = () => <TaxTypeModal {...taxTypeModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <TaxTypeSearch {...taxTypeSearchProps} />
            <TaxTypeList {...taxTypeListProps} />
            <TaxTypeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TaxTypesView;
