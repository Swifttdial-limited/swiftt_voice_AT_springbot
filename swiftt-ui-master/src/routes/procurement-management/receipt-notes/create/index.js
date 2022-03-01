import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import ReceiptNoteForm from '../../../../components/procurement-management/receipt-note/Form';

@connect(({ receiptNotes }) => ({
  receiptNotes
}))
class ReceiptNoteRegistrationView extends PureComponent {
  static propTypes = {
    receiptNotes: PropTypes.object,
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type : 'receiptNotes/purgeCurrentItem' });
  }

  render() {
    const { dispatch, receiptNotes } = this.props;

    const receiptNoteFormProps = {
      receiptNote: receiptNotes.currentItem,
      onCreate(data) {
        dispatch({ type: 'receiptNote/create', payload: data });
      },
      onCreateAndSubmit(data) {
        dispatch({ type: 'receiptNote/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Receipt Note"
        content="Internal proof of goods received to process and match against your supplier invoices/purchase orders."
      >
        <div className="content-inner">
          <ReceiptNoteForm {...receiptNoteFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default ReceiptNoteRegistrationView;
