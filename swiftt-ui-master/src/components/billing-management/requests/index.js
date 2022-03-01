import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import POSModal from '../point-of-sale/ModalView';
import BillItemsList from './List';
import BillingToolbar from './BillingToolBar';


class RequestsListView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      billableItems: [],
      billableTotal: 0,
      selectedRequestItems: {},
    };
  }
  showModal = () => {
    const { dispatch, isCredit, billItems } = this.props;
    const { activeVisitId, loading } = billItems;
    if (isCredit) {
      dispatch({
        type: 'billItems/generateInvoices',
        payload: {
          encounterId: activeVisitId,
          billItems: this.state.billableItems,
          actionType: 'GENERATE_INVOICE',
        },
      });
    }
  }

  handleModalSubmit = (payments) => {
    const { dispatch, billItems } = this.props;
    const { selectedRequestItems } = this.state;
    const { activeVisitId } = billItems;
    const payload = {
      billItems: selectedRequestItems,
      payments,
      visitId: activeVisitId,
      actionType: "CASH_PAYMENT",
      billPaymentType: 'CASH',
      billItemStatus: 'PAID',
      isRecorded: true,
    };

    dispatch({ // AFTER PROCESSING PAYMENT NAVIGATE TO PROCESSED TAB, AND PAID BILLS
      type: 'billItems/payments',
      payload
    });
  }
  handleBillableItems = (billableItems) => {
    this.setState({
      ...billableItems
    });
  }

  handlePOSModalOpen = () => {
    this.props.dispatch({
      type: 'billItems/showModal',
    });
  }

  handlePOSModalCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billItems/hideModal'
    });
  }


  render() {
    const { billItems } = this.props;
    const { billingBtnLoading, modalVisible, activeVisitId, loading, success, pagination } = billItems;
    const list = (activeVisitId && !loading && success ? billItems[activeVisitId] : []);
    const { billableTotal, selectedRequestItems } = this.state;


    const PointOfSaleModalProps = {
      modalVisible,
      selectedRequestItems,
      billableTotal,
      handleModalClose: this.handlePOSModalCancel,
      onOk: this.handleModalSubmit
    };

    const BillitemsListProps = {
      handleBillableItems: this.handleBillableItems,
      dataSource: list,
    };

    const BillingToolbarProps = {
      handleBillingButtonClick: this.handlePOSModalOpen,
      selectedRequestItems,
    }
    return (
      <div>
        <BillingToolbar {...BillingToolbarProps} />
        <POSModal {...PointOfSaleModalProps} />
        <BillItemsList {...BillitemsListProps} />
      </div>
    );
  }
}
function mapStateToProps({ billItems }) {
  return { billItems };
}
export default connect(mapStateToProps)(RequestsListView);
