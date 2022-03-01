import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Collapse, Row, Col } from 'antd';

import List from './List';
import Modal from './Modal';
import Toolbar from './Toolbar';
import EncountersSummaryList from '../encounters/EncountersSummaryList';

const Panel = Collapse.Panel;

@connect(({ medicalHistoryEntries, loading }) => ({
  medicalHistoryEntries,
  loading: loading.effects['medicalHistoryEntries/query'],
}))
class MedicalHistoryView extends PureComponent {

  static propTypes = {
    patientProfile: PropTypes.object.isRequired,
    medicalHistoryEntries: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch, patientProfile } = this.props;
    dispatch({ type: 'medicalHistoryEntries/query', payload: { patientId: patientProfile.id } });
  }

  componentDidUpdate(prevProps) {
    const { dispatch, patientProfile } = this.props;
    if (patientProfile.id !== prevProps.patientProfile.id) {
      dispatch({ type: 'medicalHistoryEntries/query', payload: { patientId: patientProfile.id } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'medicalHistoryEntries/purge' });
  }

  render() {
    const { dispatch, patientProfile, medicalHistoryEntries } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType } = medicalHistoryEntries;

    const medicalHistoryEntryModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(values) {
        values.patientId = patientProfile.id;

        if(modalType === 'create') {
          delete currentItem.id
          delete currentItem.version
        }
        
        dispatch({ type: `medicalHistoryEntries/${modalType}`, payload:  Object.assign({}, currentItem, values) });
      },
      onCancel() {
        dispatch({ type: 'medicalHistoryEntries/hideModal' });
      },
    };

    const allergiesListProps = {
      dataSource: list,
    };

    const medicalHistoryEntryListProps = {
      loading,
      onDeleteItem(id) {
        dispatch({ type: 'medicalHistoryEntries/delete', payload: {id: id, patientId: patientProfile.id } });
      },
      onEditItem(item) {
        dispatch({
          type: 'medicalHistoryEntries/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const medicalHistoryEntryToolbarProps = {
      onAdd() {
        dispatch({
          type: 'medicalHistoryEntries/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ModalGen = () => <Modal {...medicalHistoryEntryModalProps} />;

    return (
      <Collapse bordered={false} defaultActiveKey={['1']}>
        <Panel header="Allergies and Chronic Conditions" key="1">
          <Row>
            <Col xs={24} md={24} lg={24}>
              <Toolbar {...medicalHistoryEntryToolbarProps} />
              <List {...allergiesListProps} {...medicalHistoryEntryListProps} />
              <ModalGen />
            </Col>
          </Row>
        </Panel>
        <Panel header="Visit History" key="3">
          <EncountersSummaryList patient={patientProfile} />
        </Panel>
      </Collapse>
    );
  }
}

export default MedicalHistoryView;
