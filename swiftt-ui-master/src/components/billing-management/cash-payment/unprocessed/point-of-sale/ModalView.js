import React, { PureComponent } from 'react';
import { Form, Modal, Tabs, Input, InputNumber, Col, Row, Divider } from 'antd';
import PaymentFormTable from './PaymentFormTable';
import PaymentForm from './PaymentForm';
import { connect } from 'dva';
import TotalAmountCard from '../../../../common/TotalAmountCard';
import PaymentModeSelect from '../../../../common/accounting/PaymentModeSelect';


const TabPane = Tabs.TabPane;

class ModalView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
    }
  }
  componentDidMount() {
    // this.props.form.validateFields();
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  handleTabChange = (activeKey) => {
    this.setState(() => {
      activeKey: activeKey
    })
  }

  handleOk = () => {
    const { payments } = this.state;
    this.props.onOk(payments);
  }

  saveSplitting = (payments) => {
    this.setState({ payments: payments });
    console.log("send to api", payments);
  }

  handlePaymentForm = (payments) => {
    this.setState({ payments: [{ ...payments }] });
  }

  render() {
    const { modalVisible, handleModalClose, billableTotal } = this.props;
    const { payments } = this.state;

    // Here Dirt
    let receivedAmount = 0;
    let changeAmount = 0;
    let totalAmountCardProps = {};

    totalAmountCardProps = {
      description: 'Payable',
      amount: billableTotal,
    };
    let receivedAmountCardProps = {
      description: 'Received',
      amount: receivedAmount,
    };
    let changeAmountCardProps = {
      description: 'Change',
      amount: (billableTotal * 1) - (receivedAmount * 1),
    };


    // let paymentMode = getFieldValue('paymentMode');

    if (payments.length > 0) { // Reduce Received amount and total billable with rate 

      receivedAmountCardProps.amount = payments.reduce((tot, payment) => {
        const { paymentMode, paymentReference, receivedAmount } = payment;
        return tot + receivedAmount;
      }, 0);
      changeAmountCardProps.amount = (receivedAmountCardProps.amount * 1) - (totalAmountCardProps.amount * 1);
    }

    const TabsData = (
      <Row>
        <Col md={18}>
          <Tabs defaultActiveKey="singlePayment" onChange={this.handleTabChange}>
            <TabPane tab="Receive Payment" key="singlePayment">
              <PaymentForm onChange={this.handlePaymentForm} billableTotal={billableTotal} />
            </TabPane>
            <TabPane tab="Split Billing" key="splitting" >
              <PaymentFormTable onChange={this.saveSplitting} />
            </TabPane>
          </Tabs>
        </Col>
        <Col md={6}>
          <TotalAmountCard {...totalAmountCardProps} />
          <Divider />
          <TotalAmountCard {...receivedAmountCardProps} />
          <Divider />
          <TotalAmountCard {...changeAmountCardProps} />
        </Col>
      </Row>
    );

    return (
      <div>
        <Modal
          wrapClassName="vertical-center-modal"
          visible={modalVisible}
          onOk={this.handleOk}
          okButtonProps={{ disabled: (receivedAmountCardProps.amount < totalAmountCardProps.amount) }}
          width={900}
          maskClosable={false}
          onCancel={handleModalClose}
        >
          {TabsData}
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ModalView);
