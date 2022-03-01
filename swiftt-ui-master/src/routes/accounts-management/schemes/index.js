import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import SchemesList from '../../../components/accounts-management/schemes/List';
import SchemesSearch from '../../../components/accounts-management/schemes/Search';

@connect(({ schemes, loading }) => ({
  schemes,
  loading: loading.effects['schemes/query'],
}))
class SchemesView extends PureComponent {
  static propTypes = {
    schemes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({ type: 'schemes/query' });
  }

  render() {
    const { dispatch, schemes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = schemes;

    const schemeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};
        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }

        dispatch({
          type: 'schemes/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'schemes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const schemeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'schemes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Schemes"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <SchemesSearch {...schemeSearchProps} />
          <SchemesList {...schemeListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default SchemesView;
