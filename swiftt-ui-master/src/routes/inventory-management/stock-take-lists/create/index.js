import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StockTakeListForm from '../../../../components/inventory-management/stock-take-list/Form';

@connect()
class StockTakeListRegistrationView extends PureComponent {

  render() {
    const { dispatch } = this.props;

    const stockTakeListFormProps = {
      onCreate(data) {
        dispatch({ type: 'stockTakeList/create', payload: data });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'stockTakeList/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Stock Take List"
        content="Stock taking is the process of counting, weighing or otherwise calculating all items in stock and recording the results."
      >
        <div className="content-inner">
          <StockTakeListForm {...stockTakeListFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }

}

export default StockTakeListRegistrationView;
