import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { concat } from 'lodash';
import { Row, Col, Button, Radio, Avatar } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AdmissionSimpleSearch from '../../../components/ward-management/admissions/SimpleSearch';
import AdmissionList from '../../../components/ward-management/admissions/List';
import styles from '../index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ admissions, loading }) => ({
  admissions,
  loading: loading.effects['admissions/query'],
}))
class AdmissionManagementView extends PureComponent {

  static propTypes = {
    admissions: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    currentFilter: 'ACTIVE',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'admissions/query', payload: { status: this.state.currentFilter } });
  }

  admissionFilterChange = (e) => {
    const { dispatch } = this.props;
    this.setState({ currentFilter: e.target.value }, () => dispatch({ type: 'admissions/query', payload: { status: e.target.value } }));
  }

  render() {
    const { admissions, dispatch } = this.props;
    const { loading, list, newAdmissionToday, pagination, success } = admissions;

    const { currentFilter } = this.state;

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
            status: currentFilter,
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    const filterByStatusContent = (
      <RadioGroup
        onChange={this.admissionFilterChange}
        defaultValue="ACTIVE"
        style={{ float: 'right' }}
      >
        <RadioButton value="ACTIVE">Active</RadioButton>
        <RadioButton value="CLOSED">Discharged</RadioButton>
        {/* <RadioButton value="CANCELED">Canceled</RadioButton> */}
      </RadioGroup>
    );

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>Admissions</div>
          <div>View active and closed admissions.</div>
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
            <Col span={20}>
              <AdmissionSimpleSearch {...admissionSearchProps} />
            </Col>
            <Col span={4}>
              {filterByStatusContent}
            </Col>
          </Row>
          <AdmissionList {...admissionListProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default AdmissionManagementView;
