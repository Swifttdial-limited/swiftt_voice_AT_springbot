import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ReceiptNotesList from '../../../components/procurement-management/receipt-notes/List';
import ReceiptNotesSearch from '../../../components/procurement-management/receipt-notes/Search';

@connect(({ receiptNotes, loading }) => ({
  receiptNotes,
  loading: loading.effects['receiptNotes/query'],
}))
class ReceiptNotesView extends PureComponent {
  static propTypes = {
    receiptNotes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'receiptNotes/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'receiptNotes/purge' });
  }

  render() {
    const { receiptNotes, dispatch } = this.props;
    const { loading, list, pagination, success } = receiptNotes;

    const receiptNoteSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'receiptNoteNumber') {
            payload.receiptNoteNumber = fieldsValue.keyword;
          } else if(fieldsValue.field === 'purchaseInvoiceReference') {
            payload.purchaseInvoiceReference = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'receiptNotes/query', payload });
      },
    };

    const receiptNoteListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'receiptNotes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Receipt Notes"
        content="Internal proof of goods received to process and match against your supplier invoices/purchase orders."
      >
        <div className="content-inner">
          <ReceiptNotesSearch {...receiptNoteSearchProps} />
          <ReceiptNotesList {...receiptNoteListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default ReceiptNotesView;
