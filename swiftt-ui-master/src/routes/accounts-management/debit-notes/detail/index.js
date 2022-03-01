import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Tag } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import CreditNoteForm from '../../../../components/accounts-management/credit-note/Form';
import styles from './index.less';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD';

@connect(({ institutions, creditNote, loading }) => ({
  institutions,
  creditNote,
  loading: loading.effects['creditNote/query'],
}))
class GoodsReceiptNoteView extends PureComponent {
  static propTypes = {
    creditNotes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/accounts/customer-bills-and-payments/credit-note/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'creditNote/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'creditNote/purge' });
  }

  creditNotesGenerateHandler = () => {
    const { dispatch, creditNote } = this.props;
    const { data } = creditNote;

    dispatch({ type: 'creditNote/createGoodsReceiptNote', payload: { id: data.id } });
  }

  render() {
    const { dispatch, institutions, creditNote } = this.props;
    const { data, loading, success } = creditNote;

    const creditNotesFormProps = {
      creditNote: data,
      onSave(values) {
        dispatch({ type: 'creditNotes/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'creditNote/submit', payload: { id: data.id } });
      },
      onApprove(items) {
        dispatch({ type: 'creditNote/approve', payload: { id: data.id, items } });
      },
      onReject() {
        dispatch({ type: 'creditNote/reject', payload: { id: data.id } });
      },
    };

    const action = (
      <div>
        <Authorized authority="CREATE_GOODS_RECEIPT">
          <Button icon="copy" onClick={this.creditNotesGenerateHandler}>Create Goods Receipt Note</Button>
        </Authorized>
      </div>
    );

    const renderPageTitle = () => {
      switch (data.creditNotesStatus) {
        case 'INCOMPLETE':
          return <span>Edit Debit Note</span>;
        default:
          return <span>Debit Note No: {data.creditNotesNumber}</span>;
      }
    };

    const renderGoodsReceiptNoteStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">DRAFT</Tag>;
        case 'IN_PROCESS':
          return <Tag color="blue">IN PROCESS</Tag>;
        case 'PRE_APPROVED':
          return <Tag color="purple">PREAPPROVED</Tag>;
        case 'APPROVED':
          return <Tag color="green">APPROVED</Tag>;
        case 'REJECTED':
          return <Tag color="red">REJECTED</Tag>;
        case 'CANCELED':
          return <Tag color="red">CANCELED</Tag>;
        case 'DELETED':
          return <Tag color="red">DELETED</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    let description = <DescriptionList className={styles.headerList} size="small" col="2" />;
    if (data && data.id) {
      description = (
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="Created By">{data.createdBy.fullName}</Description>
          <Description term="Created At">{moment(data.createdDate).format(dateTimeFormat)}</Description>
          <Description term="Received By">{data.receivedBy ? data.receivedBy.fullName : null}</Description>
          <Description term="Received At">{data.receiveDate ? moment(data.receiveDate).format(dateFormat) : null}</Description>
          <Description term="Status">{renderGoodsReceiptNoteStatusTag(data.creditNotesStatus)}</Description>
          <Description term="">&nbsp;</Description>
        </DescriptionList>
      );
    }

    return (
      <PageHeaderLayout
        title={renderPageTitle()}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
      >
        <div className="content-inner">
          {loading ? <Card loading={loading} /> : <Card><CreditNoteForm {...creditNotesFormProps} /></Card> }
        </div>
      </PageHeaderLayout>
    );
  }
}

export default GoodsReceiptNoteView;
