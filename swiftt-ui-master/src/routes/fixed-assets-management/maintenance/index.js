import React from 'react';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AssetsMaintenance from "../../../components/fixed-assets-management/maintenance";

function AssetsMaintenanceList() {
  return (
    <PageHeaderLayout
      title="Assets Maintenance Listing Report"
      content="This is a report that shows assets Maintenance to different locations over time."
    >
      <div className="content-inner">
        <AssetsMaintenance />
      </div>
    </PageHeaderLayout>
  );
}

export default AssetsMaintenanceList;
