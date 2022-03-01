import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EncountersSimpleSearch from '../../components/encounters-management/encounters/SimpleSearch';
import EncountersList from '../../components/encounters-management/encounters/List';
import styles from './index.less';

@connect(({ encounters, loading }) => ({
  encounters,
  loading: loading.effects['encounters/query'],
}))
class EncountersManagementView extends PureComponent {

  static propTypes = {
    encounters: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = { searchType: 'simple' };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'encounters/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'encounters/purge' });
  }

  toggleSimpleSearchType = () => {
    this.setState({ searchType: 'simple' });
  }

  render() {
    const { encounters, dispatch } = this.props;
    const { loading, list, pagination, success } = encounters;

    const encounterSearchProps = {
      onSearch(fieldsValue) {
        dispatch({
          type: 'encounters/query',
          payload : fieldsValue,
        });
      },
    };

    const encounterListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'encounters/query',
          payload: {
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
          <div className={styles.contentTitle}>Visits</div>
          <div>View patient visits.</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>New Visits Today</p>
          <p>8</p>
        </div>
        <div className={styles.statItem}>
          <p>Total Visits</p>
          <p>{pagination.total}</p>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <div>
          <EncountersSimpleSearch {...encounterSearchProps} />
          <EncountersList {...encounterListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default EncountersManagementView;
