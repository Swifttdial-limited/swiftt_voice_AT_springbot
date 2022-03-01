import React from 'react';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AssetsTransfer from "../../../components/fixed-assets-management/transfer";

function AssetsTransferList() {
  return (
    <PageHeaderLayout
      title="Assets Transfer Listing Report"
      content="This is a report that shows assets Transfer to different locations over time."
    >
      <div className="content-inner">
        <AssetsTransfer />
      </div>
    </PageHeaderLayout>
  );
}

export default AssetsTransferList;
