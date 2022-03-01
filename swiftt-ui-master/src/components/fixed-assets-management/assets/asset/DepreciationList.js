import PropTypes from 'prop-types';
import React from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Icon,
  Modal,
  LocaleProvider
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const confirm = Modal.confirm;

function DepreciationListView({ loading,  asset  }) {

  const deprColumns = [
    {
      title: '#',
      dataIndex: 'yearNumber',
      key: 'yearNumber',
    },{
      title: 'Year',
      dataIndex: 'yearName',
      key: 'yearName',
    },
    {
      title: 'Opening book value',
      dataIndex: "bookValueOpening",
      key:   "bookValueOpening"
    },
    {
      title: 'Depr. Rate',
      dataIndex:"depreciationRate" ,
      key:"depreciationRate" ,
    },{
      title: 'Depreciation amount',
      dataIndex:"depreciationExpenseAmount",
      key:"depreciationExpenseAmount"
    },
    {
      title: 'Acc Depreciation',
      dataIndex:"accumulatedDeprecition",
      key:"accumulatedDeprecition",
    } ,
    {
      title: 'Closing book value',
      dataIndex:"bookValueClosing" ,
      key:"bookValueClosing" ,
    }
  ];

  return (
    <div>
      <LocaleProvider locale={enUS}>
        <Table
          //title= {" Depreciation Method " + asse}
          pagination={false}
          loading={loading}
          rowKey={record => record.yearNumber}
          dataSource={asset.depreciationTable}
          columns={deprColumns}
          size="small"
        />
      </LocaleProvider>
    </div>
  );
}

DepreciationListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  asset: PropTypes.object.isRequired,
};

export default DepreciationListView;
