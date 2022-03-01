import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import InventoryAdjustmentForm from '../../../../components/inventory-management/inventory-adjustment/Form';

@connect()
class InventoryAdjustmentRegistrationView extends PureComponent {
  render() {
    const { dispatch } = this.props;

    const inventoryAdjustmentFormProps = {
      onCreate(data) {
        dispatch({ type: 'inventoryAdjustment/create', payload: data });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'inventoryAdjustment/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Inventory Adjustment"
        //content="Description" TODO inventory adjustment description
      >
        <div className="content-inner">
          <InventoryAdjustmentForm {...inventoryAdjustmentFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default InventoryAdjustmentRegistrationView;
