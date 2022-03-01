import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import MedicoLegalList from './List';
import MedicoLegalSearch from './Search';
import MedicoLegalModal from './Modal';

@connect(({ medicoLegals, loading }) => ({
  medicoLegals,
  loading: loading.effects['medicoLegals/query']
}))
class MedicoLegalsView extends PureComponent {

  static propTypes = {
    medicoLegals: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'medicoLegals/query' });
  }

  render() {
    const { dispatch, medicoLegals } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = medicoLegals;

    const medicoLegalModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `medicoLegals/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'medicoLegals/hideModal' });
      },
    };

    const medicoLegalListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'medicoLegals/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'medicoLegals/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'medicoLegals/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const medicoLegalSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'medicoLegals/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'medicoLegals/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const MedicoLegalModalGen = () => <MedicoLegalModal {...medicoLegalModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <MedicoLegalSearch {...medicoLegalSearchProps} />
            <MedicoLegalList {...medicoLegalListProps} />
            <MedicoLegalModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MedicoLegalsView;
