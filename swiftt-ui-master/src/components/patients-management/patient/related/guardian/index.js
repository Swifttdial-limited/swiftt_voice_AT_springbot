import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import GuardiansList from './List';
import GuardianModal from './Modal';
import GuardianToolbar from './Toolbar';

@connect(({ guardians }) => ({
  guardians
}))
class GuardiansView extends PureComponent {

  static propTypes = {
    patientProfile: PropTypes.object.isRequired,
    loadData: PropTypes.bool.isRequired,
    guardians: PropTypes.object.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { loadData, dispatch, patientProfile } = this.props;

    dispatch({ type: 'guardians/purge' });
    if (loadData) { dispatch({ type: 'guardians/query', payload: { patientId: patientProfile.id } }); }
  }

  render() {
    const { location, dispatch, guardians, patientProfile} = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType
    } = guardians;

    
    const guardianModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      patientProfile,
      onOk(data) {
       
        data.patientId = patientProfile.id;
        dispatch({ type: `guardians/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'guardians/hideModal' });
      },
    };

    const guardianListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        const { query, pathname } = location;
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: page.current,
            size: page.pageSize,
          },
        }));
      },
      onDeleteItem(id) {
        dispatch({ type: 'guardians/delete', payload: { patientId: patientProfile.id, publicId: id } });
      },
      onEditItem(item) {
        dispatch({
          type: 'guardians/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const guardianToolbarProps = {
      onAdd() {
        dispatch({
          type: 'guardians/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const GuardianModalGen = () => <GuardianModal {...guardianModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <GuardianToolbar {...guardianToolbarProps} />
          <GuardiansList {...guardianListProps} />
          <GuardianModalGen />
        </Col>
      </Row>
    );
  }
}

export default GuardiansView;
