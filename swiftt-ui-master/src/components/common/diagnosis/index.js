import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import Authorized from '../../../utils/Authorized';
import DiagnosesList from './List';
import Toolbar from './Toolbar';
import DiagnosesModal from './Modal';
import PatientVisitHistory from '../../common/encounters/patientEncounters';

@connect(({ encounterDiagnoses, loading }) => ({
  diagnoses: encounterDiagnoses,
  loading: loading.effects['encounterDiagnoses/query'],
}))
class DiagnosesView extends PureComponent {

  static defaultProps = {
    encounter: {},
    diagnoses: {},
  };

  static propTypes = {
    encounter: PropTypes.object,
    diagnoses: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch, encounter } = this.props;
    dispatch({ type: 'encounterDiagnoses/fetchEncounterDiagnoses', payload: { encounterId: encounter.id } });
  }

  componentDidUpdate(prevProps) {
    const { dispatch, encounter } = this.props;
    if (encounter.id !== prevProps.encounter.id) {
      dispatch({ 
        type: 'encounterDiagnoses/fetchEncounterDiagnoses', 
        payload: { encounterId: encounter.id } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'encounterDiagnoses/purge' });
  }

  render() {
    const { dispatch, encounter, diagnoses,isPreviousVisit } = this.props;

    const {
      list: diagnosesList,
      loading: diagnosesLoading,
      modalVisible: diagnosesModalVisible,
      pagination: diagnosesPagination,
    } = diagnoses;
    const diagnosesToolbarProps = {
      isPreviousVisit,
      onAdd() {
        dispatch({
          type: 'encounterDiagnoses/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const diagnosesModalProps = {
      visible: diagnosesModalVisible,
      onOk(data) {
        data.encounterDiagnoses.forEach(encounterDiagnosis => {
          encounterDiagnosis.type = data.type;
        });
        delete data.type

        dispatch({ type: 'encounterDiagnoses/createDiagnosis', payload: Object.assign({}, data, { encounterId: encounter.id }) });
      },
      onCancel() {
        dispatch({ type: 'encounterDiagnoses/hideModal' });
      },
    };

    const diagnosesListProps = {
      dataSource: diagnosesList,
      loading: diagnosesLoading,
      pagination: diagnosesPagination,
      onDeleteItem(id) {
        dispatch({ type: 'encounterDiagnoses/delete', payload: { encounterId: encounter.id, diagnosisId: id } });
      },
    };

    const DiagnosesModalGen = () => <DiagnosesModal {...diagnosesModalProps} />;

    return (
      <Row>
        <Col>
          <div>
            {encounter.status === 'ACTIVE' && (
              <Authorized authority="CREATE_VISIT_DIAGNOSIS">
                <Toolbar {...diagnosesToolbarProps} />
              </Authorized>
            )}

            <Authorized authority="READ_VISIT_DIAGNOSES">
              <DiagnosesList {...diagnosesListProps} />
            </Authorized>
            <DiagnosesModalGen />
          </div>
        </Col>
      </Row>
    );
  }
}

export default DiagnosesView;
