import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import { getTimeDistance } from '../../../utils/utils';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import JournalsList from '../../../components/accounts-management/journals/list/List';
import JournalsSearch from '../../../components/accounts-management/journals/list/Search';
import JournalsImportModal from '../../../components/accounts-management/journals/ImportModal';

import styles from './index.less';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(({ journals, loading }) => ({
  journals,
  loading: loading.effects['journals/query'],
}))

class JournalList extends PureComponent {

  static propTypes = {
    journals: PropTypes.object,
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
      type: 'journals/query',
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
      type: 'journals/query',
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
      type: 'journals/query',
      payload: {
        startDate: rangePickerValue[0].format(dateFormat),
        endDate: rangePickerValue[1].format(dateFormat),
      },
    });
    this.setState({ rangePickerValue });
  };
  render() {
    const { journals, dispatch, location } = this.props;
    const { importModalVisible } = journals;

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
    const journalsSearchProps = {
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
      onImport() {
        dispatch({
          type: 'journals/showImportModal',
        });
      },
      onSearch(fieldsValue) {
        if (fieldsValue.keyword.length > 0) {
          const payload = {};
          if (fieldsValue.field === 'reference') {
            payload.referenceNumber = fieldsValue.keyword;
          }

          dispatch({
            type: 'journals/query',
            payload: {
              ...payload,
            },
          });
        }
      },
    };

    const journalsImportModalProps = {
      visible: importModalVisible,
      onCancel() {
        dispatch({ type: 'journals/hideImportModal' });
      },
    };

    const journalsListProps = {
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
        const directionKey = sorter.columnKey ? `${sorter.columnKey}.dir` : 'journalDate.dir';
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
          type: 'journals/query',
          payload: {
            ...filters,
            sort: sorter.columnKey,
            ...payload,
            ...pagination,
          },
        });
      },
    };

    const JournalsImportModalGen = () => <JournalsImportModal {...journalsImportModalProps} />;

    return (
      <PageHeaderLayout
        title="Journals"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <JournalsSearch {...journalsSearchProps} />
          <JournalsList {...journalsListProps} />
        </div>
        <JournalsImportModalGen />
      </PageHeaderLayout>
    );
  }
}

export default JournalList;
