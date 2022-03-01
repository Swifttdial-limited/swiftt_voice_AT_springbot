import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row,
  Col,
  Button,
  Card,
  Tag,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import PatientDepositRefundModal from '../../../../components/billing-management/patient-deposit/RefundModal';
import PatientDepositView from '../../../../components/billing-management/patient-deposit/View';
import { base64ToArrayBuffer } from '../../../../utils/utils';
import { printPatientDeposit } from '../../../../services/billing-management/deposits';

import styles from './index.less';

const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ accountingPreferences, deposit, loading }) => ({
  accountingPreferences,
  deposit,
  loading: loading.effects['deposit/query'],
}))
class PatientDepositViewWrapper extends PureComponent {
  static propTypes = {
    deposit: PropTypes.object.isRequired,
  };

  state = {
    printBtnloading: false,
  };

  componentDidMount() {
    const { accountingPreferences, dispatch, location } = this.props;
    const match = pathToRegexp('/billing/deposit/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'deposit/query', payload: { id: match[1] } });

      if (accountingPreferences.data.baseCurrency == undefined)
        this.props.dispatch({ type: 'accountingPreferences/query' });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'deposit/purge' });
  }

  refundPatientDepositHandler = () => {
    this.props.dispatch({
      type: 'deposit/showModal',
    });
  }

  handlePrint = () => {
    const { deposit } = this.props;
    const { data } = deposit;

    if (data.id) {
      this.setState({ printBtnloading: true });
      printPatientDeposit({
        depositId: data.id,
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
  }

  render() {
    const {
      accountingPreferences,
      dispatch,
      deposit
    } = this.props;
    const {
      data,
      loading,
      success,
      modalVisible,
    } = deposit;

    const { printBtnloading } = this.state;

    const depositRefundModalProps = {
      visible: modalVisible,
      item: data,
      onOk(values) {
        const payload = Object.assign({}, {id: data.id}, values)
        dispatch({ type: 'deposit/refund', payload: payload });
      },
      onCancel() {
        dispatch({ type: 'deposit/hideModal' });
      },
    };

    const depositViewProps = {
      deposit: data,
      loading,
      success,
      onRefund() {
        dispatch({ type: 'deposit/refund', payload: { id: data.id } });
      },
    };

    const action = (
      <div>
        {data.id !== undefined && (
          <Fragment>
            {!data.reversed && (
              <Authorized authority="REVERSE_PATIENT_DEPOSIT">
                <Button icon="rollback" onClick={this.refundPatientDepositHandler}>Refund</Button>
              </Authorized>
            )}
            <Button style={{ marginLeft: 10 }} icon="printer" onClick={this.handlePrint}>Print</Button>
          </Fragment>
        )}
      </div>
    );

    let description = <DescriptionList className={styles.headerList} size="small" col="3" />;
    if (data.id) {
      description = (
        <Row gutter={24}>
          <Col span={16}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Patient Name">{data.addressTo.name}</Description>
              <Description term="Patient MRN No">{data.addressTo.code}</Description>
              <Description term="Received By">{data.createdBy.fullName}</Description>
              <Description term="Received At">{data.creationDate ? moment(data.creationDate).format(dateTimeFormat) : null}</Description>
              <Description term="Comment">{data.comment}</Description>
            </DescriptionList>
          </Col>
          <Col span={8}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Patient Deposit Date">{moment(data.paymentDate).format(dateFormat)}</Description>
              <Description term="Mode of Payment">{data.paymentMode ? data.paymentMode.name : null}</Description>
              <Description term="Payment Reference">{data.paymentReference ? data.paymentReference : null}</Description>
              <Description term="Total">{accountingPreferences.data.baseCurrency !== undefined && accountingPreferences.data.baseCurrency.code} {numeral(data.depositedAmount).format('0,0.00')}</Description>
            </DescriptionList>
            {data.reversed && (
              <DescriptionList className={styles.headerList} size="small" col="1">
                <Description term="Reversed"><Tag color="red">Reversed</Tag></Description>
                <Description term="Reversed By">{data.reversedBy ? data.reversedBy.fullName : null}</Description>
                <Description term="Reversed At">{data.reversalDate ? moment(data.reversalDate).format(dateTimeFormat) : null}</Description>
              </DescriptionList>
            )}
          </Col>
        </Row>
      );
    }

    const PatientDepositRefundModalGen = () => <PatientDepositRefundModal {...depositRefundModalProps} />

    return (
      <PageHeaderLayout
        title={<span>Patient Deposit No: {data.depositNumber}</span>}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
        action={action}
      >
        <div className="content-inner">
          {loading
            ? <Card loading={loading} />
            : <Card><PatientDepositView {...depositViewProps} /></Card>
          }
        </div>
        <PatientDepositRefundModalGen />
      </PageHeaderLayout>
    );
  }
}

export default PatientDepositViewWrapper;
