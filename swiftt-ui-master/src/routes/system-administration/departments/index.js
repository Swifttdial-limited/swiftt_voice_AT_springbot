import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DepartmentList from '../../../components/system-administration/departments/List';
import DepartmentSearch from '../../../components/system-administration/departments/Search';

@connect(({ departments, loading }) => ({
  departments,
  loading: loading.effects['departments/query'],
}))
class DepartmentsView extends PureComponent {

  static propTypes = {
    departments: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'departments/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'departments/purge' });
  }

  render() {
    const { dispatch, departments } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
    } = departments;

    const departmentListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'departments/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'departments/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'departments/goToDepartmentView',
          payload: item,
        });
      },
    };

    const departmentSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.departmentName = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'departments/query',
          payload,
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Departments"
        content="Form pages are used to collect or verify information from departments. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col xs={24} md={24} lg={24}>
              <DepartmentSearch {...departmentSearchProps} />
              <DepartmentList {...departmentListProps} />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default DepartmentsView;
