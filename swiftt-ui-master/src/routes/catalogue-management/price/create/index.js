import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Icon, Button, message, Steps } from 'antd';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PricingDetailsStep from '../../../../components/catalogue-management/catalogue/price/registration/steps/PricingDetailsStep';
import PriceDeductionsStep from '../../../../components/catalogue-management/catalogue/price/registration/steps/DeductionsStep';

const Step = Steps.Step;

@connect(({ processes }) => ({
  processes,
}))
class PriceCreationView extends PureComponent {
  
  static propTypes = {
    processes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    direction: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_prices/purgeCurrentItem' });
    dispatch({ type: 'processes/updatePriceCreationStep', payload: 0 });

    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  goToNextStep = () => {
    const { dispatch, processes } = this.props;
    const { priceCreation } = processes;
    const { current } = priceCreation;

    const newCurrent = current + 1;
    dispatch({ type: 'processes/updatePriceCreationStep', payload: newCurrent });
  }

  goToPreviousStep = () => {
    const { dispatch, processes } = this.props;
    const { priceCreation } = processes;
    const { current } = priceCreation;

    const newCurrent = current - 1;
    dispatch({ type: 'processes/updatePriceCreationStep', payload: newCurrent });
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
    const { processes } = this.props;
    const { priceCreation } = processes;
    const { current } = priceCreation;

    const steps = [
      {
        title: 'Pricing details',
        icon: 'credit-card',
        content: <PricingDetailsStep />,
      }, {
        title: 'Deductions',
        icon: 'table',
        content: <PriceDeductionsStep />,
      },
    ];

    return (
      <PageHeaderLayout
        title="Price definition"
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
                  {current > 1 && <Button style={{ marginLeft: 8 }} onClick={this.goToPreviousStep}>Previous</Button>}
                  {(current < steps.length - 1) && current !== 0 ? <Button type="primary" onClick={this.goToNextStep}>Next</Button> : null}
                  {current === steps.length - 1 && (
                  <Link to="/catalogue/price-lists">
                    <Button style={{ marginLeft: 8 }} type="primary">Save &amp; Close</Button>
                  </Link>
  )}
                  {current === steps.length - 1 && (
                  <Link to="/catalogue/price/create">
                    <Button style={{ marginLeft: 8 }} type="primary">Save &amp; New</Button>
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

export default PriceCreationView;
