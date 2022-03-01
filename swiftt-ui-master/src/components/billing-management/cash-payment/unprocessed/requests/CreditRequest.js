import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import BillItemsList from './List';
import BillingToolbar from './BillingToolBar';


class RequestCreditsListView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      billableItems: [],
      billableTotal: 0,
      selectedRequestItems:{},
    };
  }

  
  handleInvoiceGeneration = (payload) => {
    const { dispatch, billItems} = this.props;
    const { activeVisitId } = billItems;
    const { selectedRequestItems } = this.state;
    dispatch({
      type: 'billItems/generateInvoices',
      payload: {
        encounterId: activeVisitId,
        billItems: selectedRequestItems,
        actionType: 'GENERATE_INVOICE',
      },
    });
  }
  handleBillableItems = (billableItems) => {
    this.setState({
      ...billableItems
    });
  }



  render() {
    const { billItems } = this.props;
    const { billingBtnLoading, modalVisible, activeVisitId, loading, success, pagination } = billItems;
    const list = (activeVisitId && !loading && success ? billItems[activeVisitId] : []);
    const { billableTotal, selectedRequestItems } = this.state;
    
    const BillitemsListProps = {
      handleBillableItems: this.handleBillableItems,
      dataSource: list,
    };

    const BillingToolbarProps = {
      handleBillingButtonClick: this.handleInvoiceGeneration,
      selectedRequestItems,
      isCredit: true,
    }
    return (
      <Card
        bodyStyle={{ padding: '0' }}
        loading={loading}
      >
        <BillingToolbar {...BillingToolbarProps} />
        <BillItemsList {...BillitemsListProps} />
      </Card>
    );
  }
}
function mapStateToProps({ billItems }) {
  return { billItems };
}
export default connect(mapStateToProps)(RequestCreditsListView);


