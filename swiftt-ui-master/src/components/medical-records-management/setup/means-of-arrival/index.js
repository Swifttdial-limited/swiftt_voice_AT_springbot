import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import ArrivalMeanList from './List';
import ArrivalMeanSearch from './Search';
import ArrivalMeanModal from './Modal';
import arrivalMeans from '../../../../models/medical-records/arrivalMeans';

@connect(({ arrivalMeans, loading }) => ({
  arrivalMeans,
  loading: loading.effects['arrivalMeans/query']
}))
class ArrivalMeansView extends PureComponent {

  static propTypes = {
    arrivalMeans: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'arrivalMeans/query' });
  }

  render() {
    const { dispatch, arrivalMeans } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = arrivalMeans;

    const arrivalMeanModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `arrivalMeans/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'arrivalMeans/hideModal' });
      },
    };

    const arrivalMeanListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'arrivalMeans/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'arrivalMeans/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'arrivalMeans/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const arrivalMeanSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'arrivalMeans/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'arrivalMeans/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ArrivalMeanModalGen = () => <ArrivalMeanModal {...arrivalMeanModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <ArrivalMeanSearch {...arrivalMeanSearchProps} />
            <ArrivalMeanList {...arrivalMeanListProps} />
            <ArrivalMeanModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ArrivalMeansView;
