import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import TaxCodeList from './List';
import TaxCodeSearch from './Search';
import TaxCodeModal from './Modal';

@connect(({ taxCodes, loading }) => ({
  taxCodes,
  loading: loading.effects['taxCodes/query'],
}))
class TaxCodesView extends PureComponent {
  static propTypes = {
    taxCodes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'taxCodes/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'taxCodes/purge' });
  }

  render() {
    const { dispatch, taxCodes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = taxCodes;

    const taxCodeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `taxCodes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'taxCodes/hideModal' });
      },
    };

    const taxCodeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'taxCodes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'taxCodes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'taxCodes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const taxCodeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'taxCodes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'taxCodes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const TaxCodeModalGen = () => <TaxCodeModal {...taxCodeModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <TaxCodeSearch {...taxCodeSearchProps} />
            <TaxCodeList {...taxCodeListProps} />
            <TaxCodeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TaxCodesView;
