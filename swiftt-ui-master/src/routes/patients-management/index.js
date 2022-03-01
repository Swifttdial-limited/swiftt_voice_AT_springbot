import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import { Icon, message, Row, Col, Card, Button, Tooltip, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PatientsSimpleSearch from '../../components/patients-management/patients/SimpleSearch';
import PatientsToolbar from '../../components/patients-management/patients/Toolbar';
import PatientsCardHolder from '../../components/patients-management/patients/PatientsCardHolder';
import SearchResultsBar from '../../components/common/SearchResultsBar';
import PatientsImportModal from '../../components/patients-management/patients/ImportModal';

import styles from './index.less';

@connect(({ patients, loading }) => ({
  patients,
  loading: loading.effects['patients/query'],
}))
class PatientManagementView extends PureComponent {

  static defaultProps = {
    patients: {},
  };

  static propTypes = {
    patients: PropTypes.object,
  };

  state = { searchType: 'simple' };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'patients/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'patients/purge',
    });
  }

  toggleSimpleSearchType = () => {
    this.setState({ searchType: 'simple' });
  }

  render() {
    const { patients, dispatch } = this.props;
    const { loading, list, newPatientsToday, importModalVisible, pagination, success } = patients;

    const { searchType } = this.state;

    const patientSearchProps = {
      onSearch(fieldsValue) {
        if (fieldsValue.keyword.length > 0) {
          const payload = {};
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          } else if (fieldsValue.field === 'medicalRecordNumber') {
            payload.medicalRecordNumber = fieldsValue.keyword;
          } else if (fieldsValue.field === 'phoneNumber') {
            payload.phoneNumber = fieldsValue.keyword;
          }

          dispatch({
            type: 'patients/query',
            payload,
          });
        }
      },
    };

    const patientToolbarProps = {
      onImport() {
        dispatch({
          type: 'patients/showImportModal',
        });
      },
    };

    const patientImportModalProps = {
      visible: importModalVisible,
      onCancel() {
        dispatch({ type: 'patients/hideImportModal' });
      },
    };

    const patientListProps = {
      dataSource: list,
      loading,
    };

    const searchResultsBarProps = {
      count: list.length,
      type: 'Patient(s)',
    };

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>Patients</div>
          <div>Register, view and edit patient profiles.</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>New Patients Today</p>
          <p>8</p>
        </div>
        <div className={styles.statItem}>
          <p>Total Patients</p>
          <p>{pagination.total}</p>
        </div>
      </div>
    );

    const PatientsImportModalGen = () => <PatientsImportModal {...patientImportModalProps} />;

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <div className="content-inner">
          <Row>
            <Col xs={24} md={24} lg={24}>

              {searchType === 'simple' && (
              <Row>
                <Col span={10}>
                  <PatientsSimpleSearch {...patientSearchProps} />
                </Col>
                <Col span={14} style={{ textAlign: 'right' }}>
                  <PatientsToolbar {...patientToolbarProps} />
                </Col>
              </Row>)}

              <PatientsCardHolder {...patientListProps} />
            </Col>
          </Row>
        </div>
        <PatientsImportModalGen />
      </PageHeaderLayout>
    );
  }
}

export default PatientManagementView;
