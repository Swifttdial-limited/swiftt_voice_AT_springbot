import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import CreditNoteForm from '../../../../components/accounts-management/credit-note/Form';

@connect()
class CreditNoteRegistrationView extends PureComponent {

  render() {
    const { dispatch } = this.props;

    const creditNoteFormProps = {
      onCreate(data) {
        console.log(data);
        dispatch({ type: 'creditNote/create', payload: data });
      },
      onCreateAndSubmit(data) {
        // dispatch({ type: 'creditNote/createAndSubmit', payload: data });
      },
    };

    return (
      <PageHeaderLayout
        title="New Debit Note"
      >
        <div className="content-inner">
          <CreditNoteForm {...creditNoteFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}
export default CreditNoteRegistrationView;
