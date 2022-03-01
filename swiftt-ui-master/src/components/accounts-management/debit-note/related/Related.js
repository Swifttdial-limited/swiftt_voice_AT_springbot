import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';

import { Icon, Tabs, message, Card } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;


function GoodsReceiptNoteRelatedDetails({
  goodsReceiptNote,
}) {
  return (
    <div>
      <Card>
        <Tabs type="card">
          <TabPane tab="Attachments" key="1">
            <FilesView context={goodsReceiptNote.id} contextType="RECEIPT_NOTE" />
          </TabPane>
          <TabPane tab="Purchase Orders" key="2">
            <p>Requisitions</p>
          </TabPane>
          <TabPane tab="Comments" key="4">
            <p>{goodsReceiptNote.comment}</p>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

GoodsReceiptNoteRelatedDetails.propTypes = {
  goodsReceiptNote: PropTypes.object.isRequired,
};

export default connect()(GoodsReceiptNoteRelatedDetails);
