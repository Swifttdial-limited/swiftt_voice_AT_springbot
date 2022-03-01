import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {
  Row,
  DatePicker,
  Col,
} from 'antd';
import { connect } from 'dva';
import ProcessedEncounterList from './encounter';
import SaleReceipts from './salesReceipts';
import SaleReceiptModal from './receipt/ModalView';


const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
class ProcessedView extends PureComponent {

  componentDidMount() {
    this.getEncounters();
  }

  getEncounters = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cashPayments/fetchEncounterReceipts',
      payload: {
        billPaymentType: 'CASH',
        billItemStatus: 'PAID',
        isRecorded: true,
      },
    });
  }

  getEncounterReceipts = (encounter) => {
    //set the active encounter
    this.fetchEncounterReceipts(encounter);
  }

  fetchEncounterReceipts = (encounter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleReceipts/fetchReceipts',
      payload: {
        visitId: encounter.visitId
      },
    });
  }

  async pageChange(pagination) {
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }
  render() {

    // const dateFilter = (
    //   <RangePicker
    //     size="small"
    //     value={rangePickerValue}
    //     onChange={handleRangePickerChange}
    //   />
    // );
    const { cashPayments } = this.props;

    const ProcessedProps = {
      ...cashPayments,
      handleOnEncounterClick: (data) => this.getEncounterReceipts(data),
      handleTableChange: () => this.pageChange
    };




    return (
      <Row gutter={4}>
        <Col md={8}>
          <QueueAnim
            delay={300}
            type="top"
            interval={200}
            className="queue-simple encounters"
            id="encounters"
          >
            <ProcessedEncounterList {...ProcessedProps} />
          </QueueAnim>
        </Col>
        <Col md={16}>
          <div style={{ background: "#fefefe" }}>
            <SaleReceipts />
          </div>
        </Col>
        <SaleReceiptModal />
      </Row>
    );
  }
}

function mapStateToProps({ cashPayments }) {
  return { cashPayments };
}
export default connect(mapStateToProps)(ProcessedView);
