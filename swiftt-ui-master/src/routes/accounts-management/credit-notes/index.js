import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CreditNotesList from '../../../components/accounts-management/credit-notes/List';
import CreditNotesSearch from '../../../components/accounts-management/credit-notes/Search';

@connect(({ creditNotes, loading }) => ({
  creditNotes,
  loading: loading.effects['creditNotes/query'],
}))
class CreditNotesView extends PureComponent {

  static propTypes = {
    creditNotes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'creditNotes/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'creditNotes/purge' });
  }

  render() {
    const { creditNotes, dispatch } = this.props;
    const { loading, list, pagination, success } = creditNotes;

    const creditNoteSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'creditNoteNumber') {
            payload.creditNoteNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'creditNotes/query', payload });
      },
    };

    const creditNoteListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'creditNotes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Credit Notes"
      >
        <div className="content-inner">
          <CreditNotesSearch {...creditNoteSearchProps} />
          <CreditNotesList {...creditNoteListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CreditNotesView;
