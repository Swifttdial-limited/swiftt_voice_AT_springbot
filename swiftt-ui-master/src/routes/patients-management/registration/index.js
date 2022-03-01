import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Icon, Button, message, Steps } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import GuardianStep from '../../../components/patients-management/registration/steps/GuardianStep';
import NextOfKinsStep from '../../../components/patients-management/registration/steps/NextOfKinsStep';
import PatientDetailsStep from '../../../components/patients-management/registration/steps/PatientDetailsStep';
import PaymentWalletsStep from '../../../components/patients-management/registration/steps/PaymentWalletsStep';
import FilesViewStep from '../../../components/patients-management/registration/steps/PatientFileAttachmentStep';

const Step = Steps.Step;

@connect(({ processes }) => ({
  processes,
}))
class PatientRegistrationView extends PureComponent {
  static propTypes = {
    processes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    direction: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'patients/purge' });
    dispatch({ type: 'processes/updatePatientRegistrationStep', payload: 0 });

    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  goToNextStep = () => {
    const { dispatch, processes } = this.props;
    const { patientCreation } = processes;
    const { current } = patientCreation;

    const newCurrent = current + 1;
    dispatch({ type: 'processes/updatePatientRegistrationStep', payload: newCurrent });
  }

  goToPreviousStep = () => {
    const { dispatch, processes } = this.props;
    const { patientCreation } = processes;
    const { current } = patientCreation;

    const newCurrent = current - 1;
    dispatch({ type: 'processes/updatePatientRegistrationStep', payload: newCurrent });
  }

  /**
  * Calculate & Update state of new dimensions
  */
  updateDimensions() {
    if (window.innerWidth < 500) {
      this.setState({ direction: 'vertical' });
    } else {
      this.setState({ direction: '' });
    }
  }

  render() {
    const { processes, location } = this.props;
    const { state } = location;
    const { patientCreation } = processes;
    const { current } = patientCreation;

    const steps = [
      {
        title: 'Patient Details',
        icon: 'user',
        content: <PatientDetailsStep {...state}/>,
      }, {
        title: 'Guardian',
        icon: 'usergroup-add',
        content: <GuardianStep />,
      }, {
        title: 'Next of Kins',
        icon: 'team',
        content: <NextOfKinsStep />,
      }, {
        title: 'Payment Wallets',
        icon: 'credit-card',
        content: <PaymentWalletsStep />,
      }, {
        title: 'Patient Documents',
        icon: 'folder-add',
        content: <FilesViewStep />,
      },
    ];

    return (
      <PageHeaderLayout
        title="Patient Registration"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row gutter={16} type="flex" justify="top" align="center">
            <Col xs={24} sm={24} md={24} lg={24}>
              <Card>
                <Steps current={current}>
                  {steps.map(item => <Step key={item.title} title={item.title} icon={<Icon type={item.icon} />} />)}
                </Steps>
                <div className="steps-content" style={{ paddingTop: 0, backgroundColor: '#fff' }}>{steps[current].content}</div>
                <div className="steps-action">
                  {current > 1 && <Button style={{ marginRight: 10 }} onClick={this.goToPreviousStep}>Previous</Button>}
                  {(current < steps.length - 1) && current !== 0 ? <Button type="primary" onClick={this.goToNextStep}>Next</Button> : null}
                  {current === steps.length - 1 && (
                    <Link to="/patients">
                      <Button style={{ marginLeft: 8 }} type="primary">Save &amp; Close</Button>
                    </Link>
                  )}
                  {current === steps.length - 1 && (
                    <Link to="/visit/create">
                      <Button style={{ marginLeft: 8 }} type="primary">Save &amp; Create Visit</Button>
                    </Link>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PatientRegistrationView;
