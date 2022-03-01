import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
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
import { random } from '../../../../utils/theme';
import { getRandomInt, getTimeDistance } from '../../../../utils/utils';
import styles from './index.less';
import numeral from 'numeral';
// eslint-disable-next-line react/no-typos
CreditEncountersListView.propTypes = {
  handleOnEncounterClick: PropTypes.func.isRequired,
};
// eslint-disable-next-line react/no-typos
CreditEncountersListView.PropTypes = {
  isActive: false,
};
const dateTimeFormat = 'YYYY-MM-DD';
const isActive = (type) => {
  // const { rangePickerValue } = this.props;
  // const value = getTimeDistance(type);
  // if (!rangePickerValue[0] || !rangePickerValue[1]) {
  //   return;
  // }
  // if (
  //   rangePickerValue[0].isSame(value[0], 'day') &&
  //   rangePickerValue[1].isSame(value[1], 'day')
  // ) {
  //   return styles.currentDate;
  // }
  return null;
};
const selectDate = (type) => {
  const rangePickerValue = getTimeDistance(type);
  // this.props.handleRangePickerChange(rangePickerValue);
};
const { RangePicker } = DatePicker;

function CreditEncountersListView({ bills, activeVisitKey,
  handleOnEncounterClick, rangePickerValue, handleRangePickerChange }) {
  const { list, loading, success, pagination } = bills;
  const dateFilter = (
    <RangePicker
      size="small"
      value={rangePickerValue}
      onChange={handleRangePickerChange}
    />
  );

  const avatar = data => (
    <div>
      <Badge
        style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
        count={data.billItemsCount}
        title={`visit has ${data.billItemsCount} bill items`}
      >
        <Tooltip placement="bottom" title={`Visit Type: ${data.visitTypeName}`}>
          <Avatar size="large" shape="square" style={{ backgroundColor: data.visitTypeColorCode }}>
            {data.visit.visitNumber}
          </Avatar>
        </Tooltip>
      </Badge>
    </div>
  );

  return (
    <QueueAnim
      delay={300}
      type="top"
      interval={200}
      className="queue-simple encounters"
      id="encounters"
    >
      <List
        header={dateFilter}
        // footer={<div>Footer</div>}
        bordered
        dataSource={list}
        size="small"
        pagination={list.length > 20 ? pagination : false}
        loading={loading}
        renderItem={invoice => (
          <List.Item
            key={invoice.id}
            onClick={() => handleOnEncounterClick(invoice)}
            className={(activeVisitKey === invoice.visit ? 'active selected' : '')}
          >
            <List.Item.Meta
              avatar={avatar(invoice)}
              title={invoice.patient.fullName}
              description={invoice.patient.medicalRecordNumber ? invoice.patient.medicalRecordNumber : ( invoice.patient.overTheCounterNumber ?  invoice.patient.overTheCounterNumber : null) }
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
    </QueueAnim>
  );
}

export default CreditEncountersListView;
