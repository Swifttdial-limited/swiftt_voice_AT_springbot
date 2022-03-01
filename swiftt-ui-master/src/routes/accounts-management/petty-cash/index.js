import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import { getTimeDistance } from '../../../utils/utils';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import List from '../../../components/accounts-management/petty-cash/list/List';
import PettyCashSearch from '../../../components/accounts-management/petty-cash/list/Search';

import styles from './index.less';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(({ pettyCash, loading }) => ({
  pettyCash,
  loading: loading.effects['pettyCash/query'],
}))

class PettyCashList extends PureComponent {
  static propTypes = {
    pettyCash: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  }
  state = {
    rangePickerValue: getTimeDistance('today'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { rangePickerValue } = this.state;
    dispatch({
      type: 'pettyCash/query',
      payload: {
        startDate: rangePickerValue[0].format(dateFormat),
        endDate: rangePickerValue[1].format(dateFormat),
      },
    });
  }
  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }
  handleRangePickerChange = (rangePickerValue) => {
    this.props.dispatch({
      type: 'pettyCash/query',
      payload: {
        startDate: rangePickerValue[0].format(dateFormat),
        endDate: rangePickerValue[1].format(dateFormat),
      },
    });
    this.setState({
      rangePickerValue,
    });
  };

  selectDate = (type) => {
    const rangePickerValue = getTimeDistance(type);
    this.props.dispatch({
      type: 'pettyCash/query',
      payload: {
        startDate: rangePickerValue[0].format(dateFormat),
        endDate: rangePickerValue[1].format(dateFormat),
      },
    });
    this.setState({ rangePickerValue });
  };
  render() {
    const { pettyCash, dispatch, location } = this.props;
    const { rangePickerValue } = this.state;

    const { query, pathname } = location;
    const dateFilter = (
      <div className={styles.dateFilterWrapper}>
        <div className={styles.dateFilter}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            Today
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            This week
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            This month
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            This year
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );
    const pettyCashSearchProps = {
      dateFilter,
      filter: {
        ...query,
      },
      onFilterChange(value) {
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...value,
            page: 1,
          },
        }));
      },
      onSearch(fieldsValue) {
        if (fieldsValue.keyword.length > 0) {
          const payload = {};
          if (fieldsValue.field === 'reference') {
            payload.referenceNumber = fieldsValue.keyword;
          }

          dispatch({
            type: 'pettyCash/query',
            payload: {
              ...payload,
            },
          });
        }
      },
    };

    const pettyCashListProps = {
      onPageChange(page) {
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: page.current,
            size: page.pageSize,
          },
        }));
      },
      // curl -v http://localhost:8080/people/search/nameStartsWith?name=K&sort=name&name.dir=desc
      onTableChange(pagination, filters, sorter) {
        const payload = {};
        let directionValue = '';

        if (sorter.order === 'descend') {
          directionValue = 'desc';
        } else if (sorter.order === 'ascend') {
          directionValue = 'asc';
        }
        const directionKey = sorter.columnKey ? `${sorter.columnKey}.dir` : 'pettyCashDate.dir';
        Object.defineProperty(
          payload,
          directionKey,
          {
            value: directionValue || 'desc',
            writable: true,
            enumerable: true,
            configurable: true,
          });
        dispatch({
          type: 'pettyCash/query',
          payload: {
            ...filters,
            sort: sorter.columnKey,
            ...payload,
            ...pagination,
          },
        });
      },
    };
    return (
      <PageHeaderLayout
        title="Petty Cash"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <PettyCashSearch {...pettyCashSearchProps} />
          <List {...pettyCashListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default PettyCashList;
