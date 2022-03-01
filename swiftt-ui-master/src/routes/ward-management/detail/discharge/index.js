import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Icon, Button, message, Steps } from 'antd';
import pathToRegexp from 'path-to-regexp';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PatientVisitDetailsCard from '../../../../components/common/encounters/PatientVisitDetailsCard';
import DiagnosesView from '../../../../components/common/diagnosis'
import AppointmentsStep from '../../../../components/ward-management/admission/related/discharge/steps/AppointmentsStep';
import DischargeSummaryStep from '../../../../components/ward-management/admission/related/discharge/steps/DischargeSummaryStep';
import MedicationsStep from '../../../../components/ward-management/admission/related/discharge/steps/MedicationsStep';
import RequestsStep from '../../../../components/ward-management/admission/related/discharge/steps/RequestsStep';

import styles from './index.less';

const Step = Steps.Step;

@connect(({ admission, processes, loading }) => ({
  admission,
  processes,
  loading: loading.effects['admission/query']
}))
class AdmissionDischargeView extends PureComponent {

  static propTypes = {
    processes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    direction: '',
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({ type: 'processes/updateAdmissionDischargeStep', payload: 0 });

    const match = pathToRegexp('/admission/discharge/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'admission/query', payload: { id: match[1] } });
    }
  }

  goToNextStep = () => {
    const { dispatch, processes } = this.props;
    const { admissionDischarge } = processes;
    const { current } = admissionDischarge;

    const newCurrent = current + 1;
    dispatch({ type: 'processes/updateAdmissionDischargeStep', payload: newCurrent });
  }

  goToPreviousStep = () => {
    const { dispatch, processes } = this.props;
    const { admissionDischarge } = processes;
    const { current } = admissionDischarge;

    const newCurrent = current - 1;
    dispatch({ type: 'processes/updateAdmissionDischargeStep', payload: newCurrent });
  }

  render() {
    const { admission, processes } = this.props;
    const { data, loading } = admission;
    const { admissionDischarge } = processes;
    const { current } = admissionDischarge;

    const steps = [
      { title: 'Discharge Medications', icon: 'file-add', content: <MedicationsStep encounter={data.visit} />},
      { title: 'Requests', icon: 'fork', content: <RequestsStep encounter={data.visit} />},
      { title: 'Appointments', icon: 'calendar', content: <AppointmentsStep encounter={data.visit} />},
      { title: 'Discharge Summary', icon: 'file-text', content: <DischargeSummaryStep encounter={data.visit} /> },
    ];

    return (
      <PageHeaderLayout
        title="Admission Discharge process"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row gutter={16} type="flex" justify="top" align="center">
            <Col xs={24} sm={24} md={24} lg={24}>

              { loading
                ?
                <div>
                  <Card loading />
                  <Card loading style={{ marginTop: 10 }} />
                  <Card loading style={{ marginTop: 10 }} />
                </div>
                :
                <div>
                  <PatientVisitDetailsCard encounter={data.visit} />

                  <Card style={{ marginTop: 10 }}>
                    <DiagnosesView encounter={data.visit} />
                  </Card>

                  <Card style={{ marginTop: 10 }}>
                    <Steps current={current}>
                      {steps.map(item => <Step key={item.title} title={item.title} icon={<Icon type={item.icon} />} />)}
                    </Steps>
                    <div className="steps-content" style={{ paddingTop: 0 }}>{steps[current].content}</div>
                    <div className="steps-action">
                      { current > 0 && <Button style={{ marginRight: 8 }} onClick={this.goToPreviousStep}>Previous</Button>}
                      { current < steps.length - 1 && <Button style={{ marginRight: 8 }} type="primary" onClick={this.goToNextStep}>Next</Button> }
                      { current === steps.length - 1 && (
                        <Link to="/admissions/occupations">
                          <Button type="primary">Finish</Button>
                        </Link>
                      ) }
                    </div>
                  </Card>
                </div>
              }

            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default AdmissionDischargeView;
