import React from 'react';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AssetsDisposal from "../../../components/fixed-assets-management/disposal";

function AssetsDisposalList() {
  return (
    <PageHeaderLayout
      title="Assets Disposal Listing Report"
      content="This is a report that shows assets Disposal to different locations over time."
    >
      <div className="content-inner">
        <AssetsDisposal />
      </div>
    </PageHeaderLayout>
  );
}

export default AssetsDisposalList;
