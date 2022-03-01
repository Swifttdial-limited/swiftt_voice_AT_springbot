import PropTypes from 'prop-types';
import React from 'react';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';

import './HierarchyChart.less';

function HierarchyChart({
  data,
  nodeComponent,
}) {
  return (
    <div id="hierarchy-chart">
      <OrgChart tree={data} NodeComponent={nodeComponent} />
    </div>
  );
}

HierarchyChart.propTypes = {
  data: PropTypes.object.isRequired,
  nodeComponent: PropTypes.func,
};

export default HierarchyChart;
