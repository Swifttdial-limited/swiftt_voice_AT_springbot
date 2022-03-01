import React, { Fragment } from 'react';
import { Button, Table, Row, Col } from 'antd';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import style from './invoiceItems.less';
import moment from 'moment';
import numeral from 'numeral';
import InstitutionHeader from '../../../common/InstitutionHeader';


const dateTimeFormat = 'YYYY-MM-DD';
function InvoiceView({ invoiceItems, encounter, activeVisit }) {
  const { activeReferenceId, pagination, data, loading} = invoiceItems;
  const columns = [{
    title: 'Date',
    dataIndex: 'journalEntryDate',
    width: '15%',
    render: text => (
      moment(text).format(dateTimeFormat)
    ),
  }, {
    title: 'Description',
    dataIndex: 'product.productName',
    width: '25%',
    }, 
    {
    //   title: 'Department',
    //   dataIndex: 'description',
    //   width: '15%',
    // }, {
    title: 'Qty',
    dataIndex: 'quantity',
    width: '5%',
    render: (text, record) => (
      numeral(text).format('0,0.00')
    ),
    align: 'right'
  }, {
    title: 'Price',
    dataIndex: 'unitPrice',
    width: '10%',
    render: (text, record) => (
      numeral(text).format('0,0.00')
    ),
    align: 'right',
  }, {
    title: 'Total',
    dataIndex: 'Total',
    width: '10%',
    render: (text, record) => (
      numeral(record.quantity * record.unitPrice).format('0,0.00')
    ),
    align: 'right'
  }, {
    title: 'Deduction',
    dataIndex: 'Deduction',
    width: '10%',
    render: (text, record) => (
      numeral((record.totalAmount * 1) -  (record.quantity * record.unitPrice)).format('0,0.00')
    ),
    align: 'right'
  }, {
    title: 'Payable',
    dataIndex: 'totalAmount',
    width: '10%',
    align: 'right',
    render: (text) => numeral(text).format('0,0.00')
  }];


  const renderFooter = () => {
    return (
      <Fragment>
        <table>
          <tbody>
            <tr className="ant-table-row  ant-table-row-level-0" >
              <td style={{ width: '70%' }} />
              <td style={{ width: '10%', textAlign: 'right', fontWeight: "bolder"}}>
                <span > Total </span>
              </td>
              <td style={{ width: '10%' }} />
              <td style={{ width: '10%' }} />
              <td style={{
                fontSize: '12px',
                textAlign: 'right',
                padding: '0 15px',
                fontWeight: "bolder",
              }} >
                {numeral(data.invoiceAmount).format('0,0.00')}
              </td>
            </tr>

          </tbody>
        </table>
      </Fragment>
    );
  };
  return (
    <div>
      {data && !loading && (
        <div className={style.invoiceItems}>
          <div className={style.organizationDetails}>
            {/* <div className={style.orgLogo}>
              <img width="100px" height="50px" alt="organization logo" />
            </div>
            <div className={style.details}>
            {data.institution !== null && 
            (
            <InstitutionHeader {...data.institution} />
            )}
            </div> */}
          </div>
          <Row>
            <div className={style.invoiceDetails}>
              <h3>Invoice No. {data.invoiceNumber}</h3>
              <h3>{moment(data.transactionDate).local().format(dateTimeFormat)}</h3>
            </div>
            <div className={style.invoicedTo}>
              Invoice to
              <h3>{data.customer.name}</h3>
              <h3>{data.customer.code}</h3>
              <h3>{data.customer.phoneNumber}</h3>
              <h3>Scheme: {data.scheme.name}</h3>
            </div>
            <div className={style.patientDetails}>
              <h3>Name: {data.patient.user.fullName}</h3>
{/*               
              <h3>Gender {data.patient.user.gender}</h3> 
              <h3>DOB: {moment(data.patient.user.dateOfBirth).format('DD YYYY MM')}</h3>  */}
            </div>
          
          </Row> 
          <Table
            columns={columns}
            dataSource={data.items}
            pagination={false}
            rowKey={record => record.lineItemReferenceId}
            size="middle"
            footer={renderFooter}
          />
          {/* <h4>{data.institution ? data.institution.tagline : null}</h4>
          <h4>You were served by:- {data.createdBy.username}</h4> */}
        </div>
      )}
    </div>
  );
}

InvoiceView.propTypes = {
  invoiceItems: PropTypes.object,
};


export default InvoiceView;
