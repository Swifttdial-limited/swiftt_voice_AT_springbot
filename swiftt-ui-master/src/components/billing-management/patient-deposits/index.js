import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col } from 'antd';

import PatientDepositsList from './List';
import PatientDepositsSearch from './Search';

@connect(({ deposits, loading }) => ({
  deposits,
  loading: loading.effects['deposits/query'],
}))
class PatientDepositsView extends PureComponent {
  static propTypes = {
    patientDeposits: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deposits/query'
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'deposits/purge' });
  }

  render() {
    const { deposits, dispatch } = this.props;
    const {
      loading,
      list,
      pagination,
      success,
    } = deposits;

    const patientDepositSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'patientDepositNumber') {
            payload.depositNumber = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'deposits/query', payload });
      },
    };

    const patientDepositListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'deposits/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    return (
      <Fragment>
        <PatientDepositsSearch {...patientDepositSearchProps} />
        <PatientDepositsList {...patientDepositListProps} />
      </Fragment>
    );
  }
}

export default PatientDepositsView;
