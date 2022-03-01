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

function EncounterBillsListView({ processedEncounters, activeVisit, loading, success, pagination, handleTableChange,
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
      dataSource={processedEncounters}
      size="small"
      pagination={false}
      loading={loading}
      // onChange={handleTableChange}
      className={styles.encounters}
      renderItem={patient => (
        <List.Item
          key={patient.visitId}
          onClick={() => handleOnEncounterClick(patient)}
          className={(activeVisit === patient.visitId ? 'active selected' : '')}
        >
          <List.Item.Meta
            avatar={avatar(patient)}
            title={patient.patientFullName}
            description={patient.patientMedicalRecordNumber}
          />
          <div>
            <span style={{
              display: 'block',
              textAlign: 'right',
              padding: 5,
            }}
            >
              <strong>Total:</strong> {numeral(patient.totalAmountPayable).format('0,0.00')}
            </span>
            <span style={{
              display: 'block',
              textAlign: 'right',
              padding: 5,
            }}
            >
              {moment(patient.visitDate)
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
