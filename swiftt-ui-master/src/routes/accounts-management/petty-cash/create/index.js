import React, { Fragment } from 'react';
import PageHeader from '../../../../components/PageHeader';
import PettyCashForm from '../../../../components/accounts-management/petty-cash/entries';

function PettyCashEntriesCreate() {
  return (
    <Fragment>
      <PageHeader
        title="Petty Cash"
        content="Enter your banking values, and record a description and details.
                  Any line details entered show on activity grids.
                  Journals should not be included on your VAT Return unless you
                specifically require an adjustment to your
                return without creating a VAT document such as an invoice."
        // wrapperClassName={styles.advancedForm}
      />
      <PettyCashForm />
    </Fragment>
  );
}

export default PettyCashEntriesCreate;
