import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import VisitTypeList from './List';
import VisitTypeSearch from './Search';
import VisitTypeModal from './Modal';

@connect(({ visitTypes, loading }) => ({
  visitTypes,
  loading: loading.effects['visitTypes/query']
}))
class VisitTypesView extends PureComponent {

  static defaultProps = {
    visitTypes: {},
  };

  static propTypes = {
    visitTypes: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'visitTypes/query' });
  }

  render() {
    const { dispatch, visitTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = visitTypes;

    const visitTypeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `visitTypes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'visitTypes/hideModal' });
      },
    };

    const visitTypeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'visitTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'visitTypes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'visitTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const visitTypeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'visitTypes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'visitTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const VisitTypeModalGen = () => <VisitTypeModal {...visitTypeModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <VisitTypeSearch {...visitTypeSearchProps} />
            <VisitTypeList {...visitTypeListProps} />
            <VisitTypeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default VisitTypesView;
