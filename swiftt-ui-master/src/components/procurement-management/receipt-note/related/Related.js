import PropTypes from 'prop-types';
import React from 'react';
import { Tabs } from 'antd';

import FilesView from '../../../common/files';

const TabPane = Tabs.TabPane;

function ReceiptNoteRelatedDetails({
  receiptNote,
}) {
  return (
    <Tabs type="card">
      <TabPane tab="Attachments" key="1">
        <FilesView
          readOnly={false}
          context={receiptNote.id}
          contextType="RECEIPT_NOTE" />
      </TabPane>
      <TabPane tab="Comments" key="4">
        <p>{receiptNote.comment}</p>
      </TabPane>
    </Tabs>
  );
}

ReceiptNoteRelatedDetails.propTypes = {
  receiptNote: PropTypes.object.isRequired,
};

export default ReceiptNoteRelatedDetails;
