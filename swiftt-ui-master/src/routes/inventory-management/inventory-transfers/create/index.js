import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import InventoryTransferForm from '../../../../components/inventory-management/inventory-transfer/Form';

@connect()
class InventoryTransferRegistrationView extends PureComponent {
  render() {
    const { dispatch } = this.props;

    const inventoryTransferFormProps = {
      onCreate(data) {
        dispatch({ type: 'inventoryTransfer/create', payload: data });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'inventoryTransfer/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Inventory Transfer"
        content="Description"
      >
        <div className="content-inner">
          <InventoryTransferForm {...inventoryTransferFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default InventoryTransferRegistrationView;
