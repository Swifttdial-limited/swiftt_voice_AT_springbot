import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PurchaseOrderForm from '../../../../components/procurement-management/purchase-order/Form';

@connect(({ purchaseOrders }) => ({
  purchaseOrders,
}))
class PurchaseOrderRegistrationView extends PureComponent {
  static propTypes = {
    purchaseOrders: PropTypes.object,
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type : 'purchaseOrders/purgeCurrentItem' });
  }

  render() {
    const {
      dispatch,
      purchaseOrders,
    } = this.props;

    const purchaseOrderFormProps = {
      purchaseOrder: purchaseOrders.currentItem,
      onCreate(data) {
        dispatch({ type: 'purchaseOrder/create', payload: data });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'purchaseOrder/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Purchase Order"
        content="Purchase order (PO) is a document issued by a buyer to the seller, providing the information about the details of the order. That is the quantity, type of product, prices, etc."
      >
        <div className="content-inner">
          <PurchaseOrderForm {...purchaseOrderFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PurchaseOrderRegistrationView;
