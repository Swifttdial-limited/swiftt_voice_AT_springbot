import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import HandOverReasonList from './List';
import HandOverReasonSearch from './Search';
import HandOverReasonModal from './Modal';

@connect(({ handOverReasons, loading }) => ({
  handOverReasons,
  loading: loading.effects['handOverReasons/query']
}))
class HandOverReasonsView extends PureComponent {

  static propTypes = {
    handOverReasons: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'handOverReasons/query' });
  }

  render() {
    const { dispatch, handOverReasons } = this.props;

    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = handOverReasons;

    const handOverReasonModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `handOverReasons/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'handOverReasons/hideModal' });
      },
    };

    const handOverReasonListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'handOverReasons/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'handOverReasons/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'handOverReasons/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const handOverReasonSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'handOverReasons/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'handOverReasons/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const HandOverReasonModalGen = () => <HandOverReasonModal {...handOverReasonModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <HandOverReasonSearch {...handOverReasonSearchProps} />
            <HandOverReasonList {...handOverReasonListProps} />
            <HandOverReasonModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default HandOverReasonsView;
