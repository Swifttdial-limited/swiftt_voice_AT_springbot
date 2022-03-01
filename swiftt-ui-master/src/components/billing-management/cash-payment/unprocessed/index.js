import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {
  Row,
  DatePicker,
  Col,
} from 'antd';
import { connect } from 'dva';
import UnprocessedEncounterList from './encounter';
import BillItemsView from './requests'


const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class UnprocessedView extends PureComponent {

  componentDidMount() {
    this.getEncounters();
  }

  getEncounters = () => {
    const { dispatch, cashPayments } = this.props;
    dispatch({
      type: 'cashPayments/fetchEncounterBills',
      payload: {
        billPaymentType: 'CASH',
        billItemStatus: 'PENDING_CASH_PAYMENT',
        isRecorded: false,
      }
    });
  }

  getEncounterBills = (encounter) => {
    //set the active encounter
    this.fetchEncounterBillItems(encounter);
  }

  fetchEncounterBillItems = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billItems/fetchVisitBillItems',
      payload: {
        visitId: payload.visitId,
        billPaymentType: 'CASH',
        billItemStatus: 'PENDING_CASH_PAYMENT',
        isRecorded: false,
      },
    });
  }


    render() {

      // const dateFilter = (
      //   <RangePicker
      //     size="small"
      //     value={rangePickerValue}
      //     onChange={handleRangePickerChange}
      //   />
      // );
      const { cashPayments, activeVisitKey } = this.props;

      console.log(activeVisitKey);
      const UnprocessedProps = {
        ...cashPayments,
        handleOnEncounterClick: (data) => this.getEncounterBills(data),
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
              <UnprocessedEncounterList {...UnprocessedProps} />
            </QueueAnim>
          </Col>
          <Col md={16}>
            <BillItemsView />
          </Col>
        </Row>
      );
    }
  }

function mapStateToProps({ cashPayments }) {
  return { cashPayments };
}
export default connect(mapStateToProps)(UnprocessedView);
