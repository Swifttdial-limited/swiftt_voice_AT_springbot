import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { LocaleProvider, Table } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

function BedOccupationsList({ bedOccupations }) {
  const columns = [
    { title: 'Bed', dataIndex: 'bed.name', key: 'bed.name' },
    { title: 'Ward', dataIndex: 'bed.ward.name', key: 'bed.ward.name' },
    { title: 'Current', dataIndex: 'current', key: 'current', render: text => <span>{text ? 'Yes' : 'No'}</span> },
    { title: 'Assigned By', dataIndex: 'assignedBy.fullName', key: 'assignedBy.fullName' },
    { title: 'Date', dataIndex: 'assignmentDate', key: 'assignmentDate', render: text => <span>{text ? moment(text).local().format(dateTimeFormat) : ''}</span> },
  ];

  return (
    <div>
      <LocaleProvider locale={enUS}>
        <Table
          bordered
          columns={columns}
          dataSource={bedOccupations}
          simple
          rowKey={record => record.id}
        />
      </LocaleProvider>
    </div>
  );
}

BedOccupationsList.defaultProps = {
  bedOccupations: [],
};

BedOccupationsList.propTypes = {
  bedOccupations: PropTypes.array.isRequired,
};

export default BedOccupationsList;
