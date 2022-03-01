import React from 'react';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AdjustmentView from "../../../components/fixed-assets-management/adjustment";

function AssetsList() {
  return (
    <PageHeaderLayout
      title="Assets Adjustment Listing Report"
      content="This is a report that shows assets adjustments to accounts over time."
    >
      <div className="content-inner">
        <AdjustmentView />
      </div>
    </PageHeaderLayout>
  );
}

export default AssetsList;
