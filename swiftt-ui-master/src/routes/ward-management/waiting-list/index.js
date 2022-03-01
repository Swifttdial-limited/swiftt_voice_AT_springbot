import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Avatar } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import WaitingListSimpleSearch from '../../../components/ward-management/waiting-list/SimpleSearch';
import WaitingListList from '../../../components/ward-management/waiting-list/List';
import styles from '../index.less';

@connect(({ admissions, loading }) => ({
  admissions,
  loading: loading.effects['admissions/query'],
}))

class WaitingListManagementView extends PureComponent {
  static propTypes = {
    admissions: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'admissions/query', payload: { status: 'PENDING' } });
  }

  render() {
    const { admissions, dispatch, location } = this.props;
    const { loading, list, pagination, success } = admissions;

    const admissionSearchProps = {
      onSearch(fieldsValue) {
        fieldsValue.keyword.length ?
          dispatch({ type: 'admissions/query',
            query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
            },
          }) : dispatch({ type: 'admissions/query' });
      },
    };

    const admissionListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'admissions/query',
          payload: {
            status: 'PENDING',
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>Scheduled Admissions</div>
          <div>View pending admission requests.</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>New Admissions Today</p>
          <p>8</p>
        </div>
        <div className={styles.statItem}>
          <p>Total Admissions</p>
          <p>{pagination.total}</p>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <div className="content-inner">
          <Row>
            <Col span={18}>
              <WaitingListSimpleSearch {...admissionSearchProps} />
            </Col>
          </Row>
          <WaitingListList {...admissionListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default WaitingListManagementView;
