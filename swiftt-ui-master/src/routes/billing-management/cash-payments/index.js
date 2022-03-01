import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UnprocessedView from '../../../components/billing-management/cash-payment/unprocessed';
import ProcessedView from '../../../components/billing-management/cash-payment/processed';

const dateFormat = 'YYYY-MM-DD';

class CashPayments extends PureComponent {
  static propTypes = {
    cashPayments: PropTypes.object.isRequired,
    encounterType: PropTypes.oneOf(['UNPROCESSED', 'PROCESSED']),
    activeVisitKey: PropTypes.string.isRequired,
  };

  static defaultProps = {
    cashPayments: {},
    activeVisitKey: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      rangePickerValue: null,
      encounterType: 'UNPROCESSED',
    };
  }
  // componentDidMount() {
  //   this.getEncounters();
  // }

  // getEncounters = () => {
  //   const { dispatch, cashPayments } = this.props;
  //   const { encounterType } = cashPayments;
  //   if (encounterType === 'UNPROCESSED') {
  //     dispatch({
  //       type: 'cashPayments/fetchBills',
  //       payload: {
  //         billPaymentType: 'CASH',
  //         billItemStatus: 'PENDING_CASH_PAYMENT',
  //         isRecorded: false,
  //       }
  //     });
  //   } else if (encounterType === 'PROCESSED') {
  //     dispatch({
  //       type: 'cashPayments/fetchReceipts',
  //     });
  //   }
  // }

  // change this to use props and send to Encounter component
  onOperationTabChange = (encounterType) => {
    const { dispatch } = this.props;

    if (encounterType === 'UNPROCESSED') {
      dispatch({
        type: 'cashPayments/fetchBills',
        payload: {
          billPaymentType: 'CASH',
          billItemStatus: 'PENDING_CASH_PAYMENT',
          isRecorded: false,
        }
      });
    } else if (encounterType === 'PROCESSED') {
      dispatch({
        type: 'cashPayments/fetchReceipts',
      });
    }
    dispatch({ type: "cashPayments/tabChange", payload: { encounterType } });

  };

  handleOnEncounterClick = (payload) => {
    const { dispatch, cashPayments } = this.props;
    const { encounterType } = cashPayments;

    dispatch({ type: 'billItems/purge' });
    if (billItemStatus === 'UNPROCESSED') {
      this.fetchEncounterBillItems(payload);
    } else if (billItemStatus === 'PROCESSED') {
      this.fetchEncounterPaidBillItems(payload);
    }
  };

  // handleRangePickerChange = (rangePickerValue) => {
  //   const { dispatch, cashPayments } = this.props;
  //   const { billItemStatus } = cashPayments;
  //   dispatch({
  //     type: 'cashPayments/fetchBills',
  //     payload: {
  //       billPaymentType: 'CASH',
  //       billItemStatus,
  //       isRecorded: (billItemStatus === 'UNPROCESSED' ? false : (billItemStatus === 'PROCESSED')),
  //       startDate: rangePickerValue[0].format(dateFormat),
  //       endDate: rangePickerValue[1].format(dateFormat),
  //     },
  //   });
  //   this.setState({
  //     rangePickerValue,
  //   });
  // };

  render() {
    const { billItems, cashPayments } = this.props;
    const { encounterType, activeVisitId } = cashPayments;
    const { rangePickerValue } = this.state;

    const tabList = [{
      key: 'UNPROCESSED',
      tab: 'Unprocessed',
    }, {
      key: 'PROCESSED',
      tab: 'Processed',
    }];

    return (
      <PageHeaderLayout
        title="Cash Payments"
        tabList={tabList}
        tabActiveKey={encounterType}
        wide={true}
        onTabChange={this.onOperationTabChange}
      >
        {encounterType === 'UNPROCESSED' &&
          <UnprocessedView />
        }
        {encounterType === 'PROCESSED' &&
          <ProcessedView />
        }
      </PageHeaderLayout>
    );
  }
}
function mapStateToProps({ billItems, cashPayments }) {
  return { billItems, cashPayments };
}
export default connect(mapStateToProps)(CashPayments);
