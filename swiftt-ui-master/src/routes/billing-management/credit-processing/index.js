import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Card, Button, DatePicker } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EncountersListView from '../../../components/billing-management/encounters';
import RequestsListView from '../../../components/billing-management/requests/CreditRequest';
import InvoicesListView from '../../../components/billing-management/invoices';
import InvoiceView from '../../../components/billing-management/invoices/detail';
import './index.less';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
class CreditPayments extends PureComponent {

  static propTypes = {
    bills: PropTypes.object.isRequired,
    activeTabKey: PropTypes.oneOf(['PENDING_INVOICE_PAYMENT', 'PROCESSED']),
    activeVisitId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    bills: {},
    activeVisitId: '',
    activeTabKey: 'PENDING_INVOICE_PAYMENT',
  };
  constructor(props) {
    super(props);
    this.state = {
      rangePickerValue: null,
      activeVisitId: '',
      detailView: false,
      activeTabKey: 'PENDING_INVOICE_PAYMENT',
    };
  }
  componentDidMount() {
    const { dispatch, bills } = this.props;
    const { billPaymentType, billItemStatus, isRecorded } = bills;

    dispatch({ type: 'billItems/purge' });
    let payload = {};
    if (billPaymentType === 'CREDIT') {
      payload = {
        billPaymentType,
        billItemStatus: 'PENDING_INVOICE_PAYMENT',
        isRecorded,
      };
    } else {
      payload = {
        billPaymentType: 'CREDIT',
        billItemStatus: 'PENDING_INVOICE_PAYMENT',
        isRecorded: false,
      };
    }
    dispatch({
      type: 'bills/fetchBills',
      payload,
    });
  }
  onOperationTabChange = (key) => {
    const { dispatch } = this.props;
    dispatch({ type: 'billItems/purge' });
    dispatch({
      type: 'bills/fetchBills',
      payload: {
        billPaymentType: 'CREDIT',
        billItemStatus: 'PENDING_INVOICE_PAYMENT',
        isRecorded: (key === 'PENDING_INVOICE_PAYMENT' ? false : (key === 'PROCESSED')),
      },
    });

    this.setState((prevState, props) => ({
      activeTabKey: key,
      detailView: false,
    })
    );
  };
  handleOnEncounterClick = (payload) => {
    const { dispatch, bills } = this.props;
    const { isRecorded } = bills;
    dispatch({ type: 'billItems/purge' });
    dispatch({ type: 'invoices/purge' });
    if (!isRecorded) {
      dispatch({
        type: 'billItems/fetchVisitBillItems',
        payload: {
          visitId: payload.visitId,
          billPaymentType: 'CREDIT',
          isRecorded: false
        },
      });
    } else if (isRecorded) {
      dispatch({
        type: 'invoices/fetchByReferenceId',
        payload: {
          visitId: payload.visitId,
             },
      });
    }
    dispatch({ // save appliction state to manage state
      type: 'bills/handleBillingView',
      payload: {
        activeVisitKey: payload.visitId,
        billPaymentType: 'CREDIT',
        isRecorded,

      }
    })
    this.setState({
      activeVisit: payload,
    });
  };
  handleRangePickerChange = (rangePickerValue) => {
    const { dispatch, bills } = this.props;
    const { billItemStatus, isRecorded } = bills;
    dispatch({
      type: 'bills/fetchBills',
      payload: {
        billPaymentType: 'CREDIT',
        isRecorded,
        billItemStatus,
        startDate: rangePickerValue[0].format(dateFormat),
        endDate: rangePickerValue[1].format(dateFormat),
      },
    });
    this.setState({
      rangePickerValue,
    });
  };

  handlerOnInvoiceClick = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoiceItems/fetchInvoiceDetails',
      payload: { sourceReferenceId: payload.sourceReferenceId },
    });
  };
  toggleInvoice = (record) => {
    if (record && record.id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'invoiceItems/fetchInvoiceDetails',
        payload: {
          customerInvoiceId: record.id,
        },
      });
      dispatch({
        type: 'encounter/query',
        payload: {
          id: record.sourceReferenceId,
        },
      });
    }
    this.setState((prevState, props) => ({
      detailView: !prevState.detailView,
      activeInvoice: record,
    })
    );
  }
  print = () => {
    const { activeInvoice } = this.state
    this.props.dispatch({
      type: 'billItems/printInvoice',
      payload: {
        invoiceId: activeInvoice.id,
        format: 'PDF'
      },
    });
  }

  render() {
    const { billItems, bills, invoices, invoiceItems, encounter } = this.props;
    const { activeVisitId } = billItems;
    const { activeTabKey, detailView, activeInvoice, rangePickerValue } = this.state;
    const { isRecorded, activeVisitKey } = bills;

    const cardStyles = {
      padding: (detailView ? 10 : 0),
      background: (detailView ? '#dedede' : ''),
    };

    const tabList = [{
      key: 'PENDING_INVOICE_PAYMENT',
      tab: 'Unprocessed',
    }, {
      key: 'PROCESSED',
      tab: 'Processed',
    }];
    // Components props
    const EncountersListViewProps = {
      handleRangePickerChange: this.handleRangePickerChange,
      rangePickerValue,
      bills,
      handleOnEncounterClick: this.handleOnEncounterClick,
      activeVisitId,
      activeVisitKey: activeVisitKey,
    };

    const RequestsListViewProps = {
      isCredit: true,
    };

    const invoiceListViewProps = {
      invoices,
      handleOnEncounterClick: this.toggleInvoice,
    };

    const InvoiceDetailViewProps = {
      invoiceItems,
      activeInvoice,
      encounter,
      activeVisit: this.state.activeVisit,
    };

    return (
      <PageHeaderLayout
        title="Credit Processing"
        tabList={tabList}
        tabActiveKey={isRecorded ? "PROCESSED" : "PENDING_INVOICE_PAYMENT"}
        onTabChange={this.onOperationTabChange}
      >
        <Row gutter={8}>
          <Col xs={24} md={8} lg={8}>
            <EncountersListView {...EncountersListViewProps} />
          </Col>
          <Col xs={24} md={16} lg={16}>
            {!isRecorded &&
              (
                <div>
                  <RequestsListView {...RequestsListViewProps} />
                </div>
              )}
            {isRecorded &&
              (
                <Card bodyStyle={cardStyles}>
                  {detailView && (
                    <div>
                      <Button onClick={() => this.toggleInvoice()} >Back</Button>
                      <Button onClick={() => this.print()} >Print</Button>
                      <InvoiceView {...InvoiceDetailViewProps} />
                    </div>
                  )}
                  {!detailView && (
                    <InvoicesListView {...invoiceListViewProps} />
                  )}
                </Card>
              )
            }
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
function mapStateToProps({ billItems, bills, invoices, invoiceItems, encounter }) {
  return { billItems, bills, invoices, invoiceItems, encounter };
}
export default connect(mapStateToProps)(CreditPayments);
