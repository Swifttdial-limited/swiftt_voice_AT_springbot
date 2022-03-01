/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import '../../../../../node_modules/antd/lib/table/style/index';

const renderItemRow = item => (
  (
      <tr className="ant-table-row">
        <td>
          <span style={{ float: 'right' }}>
            {item.accountNumber}
          </span>
        </td>
        <td>{item.accountName}</td>
        <td>
          <span style={{ float: 'right' }}>
            {`${numeral(item.amount).format('(0,0.00)')}`}
          </span>
        </td>
      </tr>
  )
);

const List = ({ dataSource }) => {
  const data = {
    assets: [],
    liabilities: [],
    equity: [],
  };
  const totalRowStyle = {
    height: '42px',
    fontSize: '13px',
    fontWeight: 800,
    color: '#A61E94',
  };
  let assetTotal = 0;
  let liabilitiesTotal = 0;
  let equityTotal = 0;

  if (dataSource.length) {
    dataSource.forEach((item) => {
      if (item.accountBalanceType === 'DEBIT_BALANCE') {
        data.assets.push(renderItemRow(item));
        assetTotal += item.amount;
      }
      if (item.accountBalanceType === 'CREDIT_BALANCE' && item.accountNumber !== '300') {
        data.liabilities.push(renderItemRow(item));
        liabilitiesTotal += item.amount;
      }
      if (item.accountBalanceType === 'CREDIT_BALANCE' && item.accountNumber === '300') {
        equityTotal += item.amount;
      }
    });
  }
  return (

    <div width="100%" className="ant-table ant-table-middle ant-table-bordered">
      <div className="ant-table-content">
        <div className="ant-table-body">
          <table className="">
            <thead className="ant-table-thead">
              <tr>
                <th>Account Number</th>
                <th>Account Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody className="ant-table-tbody">
              <tr className="ant-table-row">
                <td colSpan={3}><strong>Assets</strong></td>
              </tr>
              {data.assets}
              <tr className="ant-table-row" style={totalRowStyle}>
                <td colSpan={2}>Total Assets</td>
                <td>
                  <span style={{ float: 'right' }}>
                    {`${numeral(assetTotal).format('(0,0.00)')}`}
                  </span>
                </td>
              </tr>
              <tr className="ant-table-row">
                <td colSpan={3}><strong>Liabilities</strong></td>
              </tr>
              {data.liabilities}
              <tr className="ant-table-row" style={totalRowStyle}>
                <td colSpan={2}>Total Liabilities</td>
                <td>
                  <span style={{ float: 'right' }}>
                    {`${numeral(liabilitiesTotal).format('(0,0.00)')}`}
                  </span>
                </td>
              </tr>

              <tr className="ant-table-row">
                <td colSpan={3}><strong>Equity</strong></td>
              </tr>
              <tr className="ant-table-row">
                <td>
                  <span style={{ float: 'right' }}>
                    Retained Earnings
                  </span>
                </td>
                <td>300</td>
                <td>
                  <span style={{ float: 'right' }}>
                    {`${numeral(equityTotal).format('(0,0.00)')}`}
                  </span>
                </td>
              </tr>
              <tr className="ant-table-row" style={totalRowStyle}>
                <td colSpan={2}>Total Liability & Equity</td>
                <td>
                  <span style={{ float: 'right' }}>
                    {`${numeral(liabilitiesTotal + equityTotal).format('(0,0.00)')}`}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

List.propTypes = {

};

export default List;
