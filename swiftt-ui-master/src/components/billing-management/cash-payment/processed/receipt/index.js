import React from 'react';
import { Button, Table, Divider } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import style from './receipt.less';
import moment from 'moment';
import numeral from 'numeral';
import InstitutionHeader from '../../../../common/InstitutionHeader';
import FooterTable from './FooterTable';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
function Receipt({ receipt, organizationProfile }) {



  const columns = [{
    title: 'Description',
    dataIndex: 'product.productName',
    width: '45%',
    render: (text, record) => <span>{text}- {record.product.customProductCode ? record.product.customProductCode: record.product.productCode}</span>
  }, {
    title: 'Qty',
    dataIndex: 'quantity',
    width: '15%',
    align: 'right',
    render: text => <span>{numeral(text).format('0,0.00')}</span>
  }, {
    title: 'Price',
    dataIndex: 'unitPrice',
    width: '15%',
    align: 'right',
    render: text => <span>{numeral(text).format('0,0.00')}</span>
  }, {
    title: 'Total',
    dataIndex: 'totalAmount',
    width: '25%',
    align: 'right',
    render: text => <span>{numeral(text).format('0,0.00')}</span>
  }];

  const FooterProps = {
    payments: receipt.payments,
    items: receipt.items,
  };

  return (
    <div>
      {receipt && (
        <div className={style.receipt}>

          {organizationProfile && organizationProfile && (
            <InstitutionHeader institution={{ ...organizationProfile }} />
          )}

          <Divider
            dashed
            style={{ margin: 0 }} />
          <h3>Receipt No. {receipt.salesReceiptNumber}</h3>
          <h3>{moment(receipt.transactionDate).local().format(dateTimeFormat)}</h3>
          <h3>{receipt.patient.user.fullName}</h3>
          <h3>{receipt.patient.medicalRecordNumber}</h3>
          <Table
            className={style.receipt.items}
            columns={columns}
            dataSource={receipt.items}
            pagination={false}
            size="small"
            rowKey={record => record.lineItemReferenceId}
            footer={() => {
              return (
                <FooterTable {...FooterProps} />
              );
            }}
          />
          <h4>You were served by:- {receipt.createdBy.fullName}</h4>
        </div>
      )}
    </div>
  );
}

Receipt.propTypes = {
  receipt: PropTypes.object,
};


export default Receipt;
