import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Icon,
  Tooltip,
  List,
  Badge,
  Avatar,
  DatePicker,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import styles from './index.less';

// eslint-disable-next-line react/no-typos
EncounterBillsListView.propTypes = {
  handleOnEncounterClick: PropTypes.func.isRequired,
};

const dateTimeFormat = 'YYYY-MM-DD';

function EncounterBillsListView({ unprocessedEncounters, activeVisit, loading, success, pagination,
  handleOnEncounterClick }) {

  const avatar = patient => (
    <div>
      <Badge
        style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
        count={patient.billItemsCount}
        title={`visit has ${patient.billItemsCount} bill items`}
      >
        <Tooltip placement="bottom" title={`Visit Type: ${patient.visitTypeName}`}>
          <Avatar size="large" shape="square" style={{ backgroundColor: patient.visitTypeColorCode }}>
            {patient.visitNumber}
          </Avatar>
        </Tooltip>
      </Badge>
    </div>
  );

 

  return (
    <List
      // header={dateFilter}
      // footer={<div>Footer</div>}
      bordered
      dataSource={unprocessedEncounters}
      size="small"
      pagination={pagination}
      loading={loading}
      className={styles.encounters}
      renderItem={encounter => (
        <List.Item
          key={encounter.visitId}
          onClick={() => handleOnEncounterClick(encounter)}
          className={(activeVisit === encounter.visitId ? 'active selected' : '')}
        >
          <List.Item.Meta
            avatar={avatar(encounter)}
            title={encounter.patientFullName}
            description={encounter.patientMedicalRecordNumber}
          />
          <div>
            <span style={{
              display: 'block',
              textAlign: 'right',
              padding: 5,
            }}
            >
              <strong>Total:</strong> {numeral(encounter.totalAmountPayable).format('0,0.00')}
            </span>
            <span style={{
              display: 'block',
              textAlign: 'right',
              padding: 5,
            }}
            >
              {moment(encounter.visitDate)
                .local()
                .format(dateTimeFormat)}
            </span>
          </div>
        </List.Item>
      )}
    />
  );
}

export default EncounterBillsListView;
