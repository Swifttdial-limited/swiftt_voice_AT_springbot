import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import AppointmentTypeList from './List';
import AppointmentTypeSearch from './Search';
import AppointmentTypeModal from './Modal';

@connect(({ appointmentTypes, loading }) => ({
  appointmentTypes,
  loading: loading.effects['appointmentTypes/query']
}))
class AppointmentTypesView extends PureComponent {

  static propTypes = {
    appointmentTypes: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'appointmentTypes/query' });
  }

  render() {
    const { dispatch, appointmentTypes } = this.props;

    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = appointmentTypes;

    const appointmentTypeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `appointmentTypes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'appointmentTypes/hideModal' });
      },
    };

    const appointmentTypeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'appointmentTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'appointmentTypes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'appointmentTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const appointmentTypeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'appointmentTypes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'appointmentTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const AppointmentTypeModalGen = () => <AppointmentTypeModal {...appointmentTypeModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <AppointmentTypeSearch {...appointmentTypeSearchProps} />
            <AppointmentTypeList {...appointmentTypeListProps} />
            <AppointmentTypeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppointmentTypesView;
