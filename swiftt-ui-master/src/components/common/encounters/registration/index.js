import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Icon,
  Button,
  message,
  Steps,
} from 'antd';

import EncounterDetailsStep from './steps/EncounterDetailsStep';
import RequestDetailsStep from './steps/RequestDetailsStep';
import styles from './index.less';

const Step = Steps.Step;

@connect(({ processes }) => ({
  processes,
}))
class EncounterRegistrationView extends PureComponent {

  static defaultProps = {
    allowRequestCreation: false,
  };

  static propTypes = {
    allowRequestCreation: PropTypes.bool,
    appointment: PropTypes.object,
    patient: PropTypes.object.isRequired,
    processes: PropTypes.object.isRequired,
  };

  state = {
    direction: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'processes/updateVisitCreationStep', payload: 0 });
  }

  render() {
    const { allowRequestCreation, processes, patient, appointment } = this.props;
    const { visitCreation } = processes;
    const { current } = visitCreation;

    const encounterDetailsStep = (
      patient.id ? <EncounterDetailsStep patient={patient} appointment={appointment} /> : null
    );

    const requestDetailsStep = (
      <RequestDetailsStep />
    );

    const steps = [
      {
        title: 'Visit Details',
        icon: 'file-add',
        content: encounterDetailsStep,
      }, {
        title: 'Requests',
        icon: 'fork',
        content: requestDetailsStep,
      },
    ];

    return (
      <div className="content-inner">
        <Row gutter={16} type="flex" justify="top" align="center">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card>
              { allowRequestCreation ? (
                <div>
                  <Steps current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title} icon={<Icon type={item.icon} />} />)}
                  </Steps>
                  <div className="steps-content" style={{ paddingTop: 30 }}>{steps[current].content}</div>
                  <div className="steps-action">
                    { current === steps.length - 1 && (
                      <Link to="/patients">
                        <Button type="primary">Close</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (encounterDetailsStep)}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EncounterRegistrationView;
