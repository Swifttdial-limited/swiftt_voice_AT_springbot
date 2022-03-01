import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Button, Row, Col, Modal } from 'antd';

import DescriptionList from '../../DescriptionList';
import RelatedView from './related/Related';
import StockTakeItemsTableForm from './StockTakeItemsTableForm';

const confirm = Modal.confirm;
const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function StockTakeListView({
  loading,
  onReconcile,
  assetStockTakeList,
}) {

  function handleReconcile() {
    confirm({
      title: 'Are you sure you want to reconcile and update stock balances?',
      onOk() {
        onReconcile({ id: assetStockTakeList.id });
      },
    });
  }

  return (
    <div>
      <Row>
        <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
          { assetStockTakeList.status === 'APPROVED' && !assetStockTakeList.reconciled && (
            <div>
              <Button
                style={{ marginRight: 10 }}
                loading={loading}
                icon="switcher"
                onClick={handleReconcile}>Reconcile</Button>
            </div>
          )}
        </Col>
      </Row>

      <StockTakeItemsTableForm
        enableAddItem={false}
        readOnly={true}
        rowSelectionEnabled={false}
        value={assetStockTakeList.items} />

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView assetStockTakeList={assetStockTakeList} /></Col>
      </Row>

      <br />

      <DescriptionList size="small" col="2">
        <Description term="Created By">{assetStockTakeList.createdBy.fullName}</Description>
        <Description term="Created Date">{moment(assetStockTakeList.creationDate).local().format(dateTimeFormat)}</Description>
        <Description term="Approved By">{assetStockTakeList.createdBy.fullName}</Description>
        <Description term="Approve Date">{moment(assetStockTakeList.creationDate).local().format(dateTimeFormat)}</Description>
      </DescriptionList>
    </div>
  );
}

StockTakeListView.propTypes = {
  onReconcile: PropTypes.func,
  assetStockTakeList: PropTypes.object.isRequired,
};

export default StockTakeListView;
