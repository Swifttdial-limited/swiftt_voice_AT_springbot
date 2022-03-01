import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DepartmentalItemsList from '../../../components/workspace/items/List';
import DepartmentalItemsSearch from '../../../components/workspace/items/Search';

@connect(({ catalogue_prices, login, loading }) => ({
  departmentalItems: catalogue_prices,
  department: login.currentUser.department,
  loading: loading.effects['catalogue_prices/query'],
}))
class DepartmentalItemsManagementView extends PureComponent {
  static defaultProps = {
    department: null,
    departmentalItems: {},
  };

  static propTypes = {
    department: PropTypes.object,
    departmentalItems: PropTypes.object,
  };

  componentDidMount() {
    const { department, dispatch } = this.props;
    dispatch({ type: 'catalogue_prices/purge' });

    if (department) {
      dispatch({
        type: 'catalogue_prices/query',
        payload: {
          billingDepartment: department.publicId,
        },
      });
    }
  }

  render() {
    const { departmentalItems, department, dispatch } = this.props;
    const { loading, list, pagination, success } = departmentalItems;

    const departmentalItemSearchProps = {
      onFilterChange(value) {},
      onSearch(fieldsValue) {
        const payload = {};

        if (department) {
          payload.billingDepartment = department.publicId;
          if (fieldsValue.keyword.length > 0) {
            if (fieldsValue.field === 'name') {
              payload.productName = fieldsValue.keyword;
            }
          }

          dispatch({
            type: 'catalogue_prices/query',
            payload,
          });
        }
      },
    };

    const departmentalItemListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {},
    };

    return (
      <PageHeaderLayout
        title="Department Items"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col>
              <DepartmentalItemsSearch {...departmentalItemSearchProps} />
              <DepartmentalItemsList {...departmentalItemListProps} />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default DepartmentalItemsManagementView;
