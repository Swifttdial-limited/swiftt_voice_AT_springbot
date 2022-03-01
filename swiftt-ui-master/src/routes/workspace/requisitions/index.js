import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Tabs, message, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import RequisitionsList from '../../../components/common/procurement/requisitions/List';
import RequisitionsSearch from '../../../components/common/procurement/requisitions/Search';

@connect(({ requisitions, loading }) => ({
  requisitions,
  loading: loading.effects['requisitions/query'],
}))
class RequisitionsView extends PureComponent {
  static propTypes = {
    requisitions: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'requisitions/query', payload: { departmental: true } });
  }

  render() {
    const { requisitions, dispatch } = this.props;
    const { loading, list, pagination, success } = requisitions;

    const requisitionSearchProps = {
      workspace: true,
      onSearch(fieldsValue) {
        const payload = {
          departmental: true
        };

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'requisitionNumber') {
            payload.requisitionNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'requisitions/query', payload });
      },
    };

    const requisitionListProps = {
      dataSource: list,
      loading,
      pagination,
      workspace: true,
      onPageChange(page) {
        dispatch({ type: 'requisitions/query',
          payload: {
            departmental: true,
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Departmental Requisitions"
        content="Purchase requisition is a request sent internally within a company to obtain purchased goods and services telling the purchasing department exactly what items and services are requested, the quantity, source and associated costs."
      >
        <div className="content-inner">
          <RequisitionsSearch {...requisitionSearchProps} />
          <RequisitionsList {...requisitionListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default RequisitionsView;
