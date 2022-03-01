import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import DischargeDispositionList from './List';
import DischargeDispositionSearch from './Search';
import DischargeDispositionModal from './Modal';

@connect(({ dischargeDispositions, loading }) => ({
  dischargeDispositions,
  loading: loading.effects['dischargeDispositions/query']
}))
class DischargeDispositionsView extends PureComponent {

  static propTypes = {
    dischargeDispositions: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'dischargeDispositions/query' });
  }

  render() {
    const { dispatch, dischargeDispositions } = this.props;

    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = dischargeDispositions;

    const dischargeDispositionModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `dischargeDispositions/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'dischargeDispositions/hideModal' });
      },
    };

    const dischargeDispositionListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'dischargeDispositions/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'dischargeDispositions/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'dischargeDispositions/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const dischargeDispositionSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'dischargeDispositions/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'dischargeDispositions/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const DischargeDispositionModalGen = () => <DischargeDispositionModal {...dischargeDispositionModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <DischargeDispositionSearch {...dischargeDispositionSearchProps} />
            <DischargeDispositionList {...dischargeDispositionListProps} />
            <DischargeDispositionModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DischargeDispositionsView;
