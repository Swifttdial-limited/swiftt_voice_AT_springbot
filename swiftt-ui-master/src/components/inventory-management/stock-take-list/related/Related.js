import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';

import { Icon, Tabs, message, Card } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function StockTakeListRelatedDetails({
  stockTakeList,
}) {
  return (
    <div>
      <Card>
        <Tabs type="card">
          <TabPane tab="Attachments" key="1">
            <FilesView context={stockTakeList.id} contextType="STOCKTAKE_LIST" />
          </TabPane>
          <TabPane tab="Comments" key="4">
            <p>{stockTakeList.comment}</p>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

StockTakeListRelatedDetails.propTypes = {
  stockTakeList: PropTypes.object.isRequired,
};

export default StockTakeListRelatedDetails;
