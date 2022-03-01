import React, { PureComponent } from 'react';
import {
  List,
  Button,
  Card,
  Icon,
} from 'antd';
import { filter, isEmpty } from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import ReceiptView from '../receipt';
import DescriptionList from '../../../../../components/DescriptionList';
import { printPdf } from '../../../../../services/billing-management/bills';
import { base64ToArrayBuffer } from '../../../../../utils/utils';


const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const { Description } = DescriptionList;

class SaleReceiptsListView extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detailView: false,
      activeReceipt: {},
      printBtnloading: false,
    };
  }

  print = (receipt) => {
    this.setState({ printBtnloading: true });
    printPdf({
      salesReceiptId: receipt.id,
      format: 'PDF',
    }).then((response) => {
      const blob = new Blob([base64ToArrayBuffer(response)], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      // Open the URL on new Window
      window.open(fileURL);
      this.setState({ printBtnloading: false });
    }).catch((_e) => {
      this.setState({ printBtnloading: false });
    });
  }

  viewReceipt = (receipt) => {
    if (receipt && receipt.id) {
      this.props.dispatch({
        type: 'saleReceipt/fetchReceipt',
        payload: {
          saleReceiptId: receipt.id,
        },
      });
    }
  }

  render() {
    const { saleReceipts } = this.props;
    const { detailView, activeReceipt, printBtnloading } = this.state;
    const { loading, success, pagination, list } = saleReceipts;



    return (
      <List
        loading={loading}
        // pagination={pagination}
        grid={{ gutter: 4, column: 3 }}
        dataSource={list}
        renderItem={saleReceipt => (
          <List.Item>
            <Card
              hoverable
              bodyStyle={{ padding: 5 }}
              headStyle={{ padding: '0px 5px' }}
              size="small"
              title={`Receipt No: ${saleReceipt.salesReceiptNumber}`}
              actions={[<Button icon="eye" onClick={() => this.viewReceipt(saleReceipt)} >View</Button>, <Button icon="printer" loading={printBtnloading} onClick={() => this.print(saleReceipt)} >Print</Button>]}
            >
              <DescriptionList size="small" col={1}>
                <Description term="Patient">{`${saleReceipt.patient.user.fullName}`}</Description>
                <Description term="Patient No">{`${saleReceipt.patient.medicalRecordNumber ? saleReceipt.patient.medicalRecordNumber : (saleReceipt.patient.overTheCounterNumber ? saleReceipt.patient.overTheCounterNumber : "")}`}</Description>
                {/* <Description term="Process By">{`${saleReceipt.salesReceiptNumber}`}</Description> */}
                <Description term="Visit Number">{`${saleReceipt.visit.visitNumber}`}</Description>
                <Description term="Date">{moment(saleReceipt.transactionDate)
                  .local()
                  .format(dateTimeFormat)}</Description>
              </DescriptionList>

            </Card>
          </List.Item>
        )}
      />
    );
  }
}
function mapStateToProps({ saleReceipts }) {
  return { saleReceipts };
}
export default connect(mapStateToProps)(SaleReceiptsListView);
