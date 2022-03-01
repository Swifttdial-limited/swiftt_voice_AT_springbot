import React, { PureComponent } from 'react';
import { Form, Modal, Tabs, Input, InputNumber, Col, Row, Divider } from 'antd';
import { connect } from 'dva';
import Receipt from './index';


const TabPane = Tabs.TabPane;

@connect(({ saleReceipt, institution, loading }) => ({
  saleReceipt,
  institution,
  loading: loading.effects['saleReceipt/query'],
}))

class ReceiptModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
    }
  }
  componentDidMount() {
    //Every Receipt load the institution
    this.getInsitutionDetails();
  }

  componentDidUpdate(prevProps) {
    const { saleReceipt } = this.props;
    const { receiptId  } = saleReceipt;
    if (receiptId !== prevProps.saleReceipt.receiptId) {
      this.getInsitutionDetails();
    }
  }

  getInsitutionDetails = () => {
    this.props.dispatch({ type: 'institution/queryMyInstitution' });
  }

  handleModalClose = () => {
    this.props.dispatch({ type: 'saleReceipt/hideReceipt' });
  }

  render() {

    const { saleReceipt, institution } = this.props;
    const { modalVisible } = saleReceipt;

    const ReceiptPreviewProps = {
      organizationProfile: institution.data,
      receipt: saleReceipt.data,
    };

    return (
      <div>
        <Modal
          visible={modalVisible}
          style={{ top: 20, }}
          // onOk={this.handleOk}
          // okButtonProps={{ disabled: (receivedAmountCardProps.amount < totalAmountCardProps.amount) }}
          width={400}
          maskClosable={false}
          onCancel={this.handleModalClose}
          footer={null}
        >
          <Receipt {...ReceiptPreviewProps} />
        </Modal>
      </div>
    );
  }
}

export default ReceiptModal;
