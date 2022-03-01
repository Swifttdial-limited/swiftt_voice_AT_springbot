import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Icon, Button, Steps } from 'antd';

import SalesReceiptIdentificationStep from './steps/SalesReceiptIdentificationStep';
import './formStepWrapper.less';

const { Step } = Steps;

@connect(({ processes }) => ({
  processes,
}))
class StepPage extends PureComponent {

  static propTypes = {
    processes: PropTypes.object.isRequired,
  };

  state = { direction: '' };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'contacts/purge' });
    dispatch({ type: 'processes/updateCustomerRefundStep', payload: 0 });

    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'contacts/query' });
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  goToNextStep = () => {
    const { dispatch, processes } = this.props;
    const { contactCreation } = processes;
    const { current } = contactCreation;

    const newCurrent = current + 1;
    dispatch({ type: 'processes/updateCustomerRefundStep', payload: newCurrent });
  }

  goToPreviousStep = () => {
    const { dispatch, processes } = this.props;
    const { contactCreation } = processes;
    const { current } = contactCreation;

    const newCurrent = current - 1;
    dispatch({ type: 'processes/updateCustomerRefundStep', payload: newCurrent });
  }

  updateDimensions() {
    if (window.innerWidth < 500) {
      this.setState({ direction: 'vertical' });
    } else {
      this.setState({ direction: '' });
    }
  }

  render() {
    const { processes } = this.props;
    const { contactCreation } = processes;
    const { current } = contactCreation;

    const steps = [
      {
        title: 'Sales Receipt',
        icon: 'profile',
        content: <SalesReceiptIdentificationStep />,
      }, {
        title: 'Refund Details',
        icon: 'form',
        content: <SalesReceiptIdentificationStep />,
      },
    ];

    return (
      <div>
        <Row gutter={16} type="flex" justify="top" align="center">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Card>
              <Steps current={current}>
                {steps.map(item => <Step key={item.title} title={item.title} icon={<Icon type={item.icon} />} />)}
              </Steps>
              <div className="steps-content" style={{ paddingTop: 0, backgroundColor: '#fff' }}>{steps[current].content}</div>
              <div className="steps-action">
                {current > 1 && <Button style={{ marginLeft: 8 }} onClick={this.goToPreviousStep}>Previous</Button>}
                {(current < steps.length - 1) && current !== 0 ? <Button type="primary" onClick={this.goToNextStep}>Next</Button> : null}
                {current === steps.length - 1 && (
                  <Link to="/accounts/contacts/">
                    <Button style={{ marginLeft: 8 }} type="primary">Save &amp; Close</Button>
                  </Link>
                )}
                {current === steps.length - 1 && (
                  <Link to="/accounts/contact/create">
                    <Button style={{ marginLeft: 8 }} type="primary">Save &amp; New</Button>
                  </Link>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default StepPage;
