import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Card, Steps } from 'antd';

const Step = Steps.Step;

class DischargeProcessCard extends PureComponent {

  static propTypes = {
    encounter: PropTypes.object.isRequired,
  };

  state = {
    currentStep: 0,
  };

  componentWillReceiveProps(nextProps) {
    if ('encounter' in nextProps) {
      const currentStage = nextProps.encounter.dischargeProcessStage;
      if (currentStage === 'INITIATED')
          this.setState({ currentStep: 0 });
      else if(currentStage === 'PENDING_DISCHARGE')
          this.setState({ currentStep: 1 });
      else if(currentStage === 'DISCHARGED')
          this.setState({ currentStep: 2 });
    }
  }

  render() {
    const { currentStep } = this.state;

    return(
      <Card
        title="Discharge Process"
        style={{ marginTop: '10px' }}>
        <Steps progressDot current={currentStep}>
          <Step title="Process Initiated" />
          <Step title="Discharge Processed" />
          <Step title="Bill Processed and Discharged" />
        </Steps>
      </Card>
    );

  }

}

export default DischargeProcessCard;
