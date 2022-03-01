import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Tag } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import GoodsReceiptNoteForm from '../../../../components/inventory-management/goods-receipt-note/Form';
import styles from './index.less';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ institutions, goodsReceiptNote, loading }) => ({
  institutions,
  goodsReceiptNote,
  loading: loading.effects['goodsReceiptNote/query'],
}))
class GoodsReceiptNoteView extends PureComponent {
  static propTypes = {
    goodsReceiptNote: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/procurement/receipt-note/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'goodsReceiptNote/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'goodsReceiptNote/purge' });
  }

  goodsReceiptNoteGenerateHandler = () => {
    const { dispatch, goodsReceiptNote } = this.props;
    const { data } = goodsReceiptNote;

    dispatch({ type: 'goodsReceiptNote/createGoodsReceiptNote', payload: { id: data.id } });
  }

  render() {
    const { dispatch, institutions, goodsReceiptNote } = this.props;
    const { data, loading, success } = goodsReceiptNote;

    const goodsReceiptNoteFormProps = {
      goodsReceiptNote: data,
      onSave(values) {
        dispatch({ type: 'goodsReceiptNote/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'goodsReceiptNote/submit', payload: { id: data.id } });
      },
      onApprove() {
        dispatch({ type: 'goodsReceiptNote/approve', payload: { id: data.id } });
      },
      onReject() {
        dispatch({ type: 'goodsReceiptNote/reject', payload: { id: data.id } });
      },
    };

    const action = (
      <div>
        <Authorized authority="CREATE_GOODSS_RECEIPT">
          <Button icon="copy" onClick={this.goodsReceiptNoteGenerateHandler}>Create Goods Receipt Note</Button>
        </Authorized>
      </div>
    );

    const renderPageTitle = () => {
      switch (data.goodsReceiptNoteStatus) {
        case 'INCOMPLETE':
          return <span>Edit Goods Receipt Note</span>;
        default:
          return <span>Goods Receipt Note No: {data.goodsReceiptNoteNumber}</span>;
      }
    };

    const renderGoodsReceiptNoteStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">INCOMPLETE</Tag>;
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
    if (data.id) {
      description = (
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="Created By">{data.createdBy.fullName}</Description>
          <Description term="Created At">{moment(data.createdDate).format(dateTimeFormat)}</Description>
          <Description term="Received By">{data.receivedBy ? data.receivedBy.fullName : null}</Description>
          <Description term="Received At">{data.receivedDate ? moment(data.receivedDate).format(dateTimeFormat) : null}</Description>
          <Description term="Status">{renderGoodsReceiptNoteStatusTag(data.goodsReceiptNoteStatus)}</Description>
          <Description term="">&nbsp;</Description>
        </DescriptionList>
      );
    }

    return (
      <PageHeaderLayout
        title={renderPageTitle()}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
        action={action}
      >
        <div className="content-inner">
          {loading ? <Card loading={loading} /> : <Card><GoodsReceiptNoteForm {...goodsReceiptNoteFormProps} /></Card> }
        </div>
      </PageHeaderLayout>
    );
  }
}

export default GoodsReceiptNoteView;
