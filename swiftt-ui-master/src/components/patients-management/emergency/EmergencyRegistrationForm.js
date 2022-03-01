import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

import { Row, Col, Card, Icon, Button, message, Steps, Form, Input, Select, Tooltip, Radio, LocaleProvider,
  InputNumber, DatePicker } from 'antd';

class EmergencyRegistrationForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'processes/updatePatientRegistrationStep', payload: 0 });

    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
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
    const { emergencyRegistration } = this.props;
    // const {patientCreation} = processes
    // const {current} = patientCreation


    return (
      <Row gutter={16} type="flex" justify="top" align="center">
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card title="Emergency Patient Registration">
            <Form
              className="emergency-registration-form"
              onSubmit={this.handleSubmit}
            />

          </Card>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps({ emergencyRegistration }) {
  return { emergencyRegistration };
}

export default connect(mapStateToProps)(EmergencyRegistrationForm);
