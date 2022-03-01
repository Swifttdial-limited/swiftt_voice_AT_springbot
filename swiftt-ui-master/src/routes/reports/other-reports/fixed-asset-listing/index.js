import React from 'react';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import AssetsView from "../../../../components/fixed-assets-management/report";

function AssetsList() {
  return (
    <PageHeaderLayout
      title="Assets Listing Report"
      content="This is a report that shows assets accumulated."
    >
      <div className="content-inner">
        <AssetsView />
      </div>
    </PageHeaderLayout>
  );
}

export default AssetsList;
