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
  stockTakeList,
}) {

  function handleReconcile() {
    confirm({
      title: 'Are you sure you want to reconcile and update stock balances?',
      onOk() {
        onReconcile({ id: stockTakeList.id });
      },
    });
  }

  return (
    <div>
      <Row>
        <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
          { stockTakeList.status === 'APPROVED' && !stockTakeList.reconciled && (
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
        value={stockTakeList.items} />

      <br />

      <Row gutter={24}>
        <Col span={16}><RelatedView stockTakeList={stockTakeList} /></Col>
      </Row>

      <br />

      <DescriptionList size="small" col="2">
        <Description term="Created By">{stockTakeList.createdBy.fullName}</Description>
        <Description term="Created Date">{moment(stockTakeList.creationDate).local().format(dateTimeFormat)}</Description>
        <Description term="Approved By">{stockTakeList.createdBy.fullName}</Description>
        <Description term="Approve Date">{moment(stockTakeList.creationDate).local().format(dateTimeFormat)}</Description>
      </DescriptionList>
    </div>
  );
}

StockTakeListView.propTypes = {
  onReconcile: PropTypes.func,
  stockTakeList: PropTypes.object.isRequired,
};

export default StockTakeListView;
