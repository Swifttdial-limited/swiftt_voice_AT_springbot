import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Card, Tag } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StockTakeListForm from '../../../../components/inventory-management/stock-take-list/Form';
import StockTakeListView from '../../../../components/inventory-management/stock-take-list/View';
import styles from './index.less';

const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';

@connect(({ stockTakeList, loading }) => ({
  stockTakeList,
  loading: loading.effects['stockTakeList/query'],
}))
class StockTakeListViewWrapper extends PureComponent {
  static propTypes = {
    stockTakeList: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/inventory/stock-take-list/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'stockTakeList/query', payload: { id: match[1] } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'stockTakeList/purge' });
  }

  render() {
    const { dispatch, stockTakeList } = this.props;
    const { data, loading, success } = stockTakeList;

    const stockTakeListFormProps = {
      stockTakeList: data,
      onSave(values) {
        dispatch({ type: 'stockTakeList/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'stockTakeList/submit', payload: { id: data.id } });
      },
      onApprove(items) {
        dispatch({ type: 'stockTakeList/approve', payload: { id: data.id, items: items } });
      },
      onReject() {
        dispatch({ type: 'stockTakeList/reject', payload: { id: data.id } });
      },
    };

    const stockTakeListViewProps = {
      loading,
      success,
      stockTakeList: data,
      onReconcile() {
        dispatch({ type: 'stockTakeList/reconcile', payload: { id: data.id } });
      },
    };

    const renderPageTitle = () => {
      switch (data.stockTakeListStatus) {
        case 'INCOMPLETE':
          return <span>Edit Stocktake List</span>;
        default:
          return <span>Stocktake List No: {data.stockTakeListNumber}</span>;
      }
    };

    const renderStockTakeListStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">INCOMPLETE</Tag>;
        case 'IN_PROCESS':
          return <Tag color="blue">IN PROCESS</Tag>;
        case 'PRE_APPROVED':
          return <Tag color="purple">PREAPPROVED</Tag>;
        case 'APPROVED':
          return <Tag color="green">APPROVED</Tag>;
        case 'REJECTED':
          return <Tag color="red">REJECTED</Tag>;
        case 'CANCELED':
          return <Tag color="red">CANCELED</Tag>;
        case 'DELETED':
          return <Tag color="red">DELETED</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    let description = <DescriptionList className={styles.headerList} size="small" col="2" />;
    if (data.id) {
      description = (
        <Row gutter={24}>
          <Col span={16}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Location">{data.location.name}</Description>
              <Description term="Created By">{data.createdBy ? data.createdBy.fullName : null}</Description>
              <Description term="Created At">{data.createdDate ? moment(data.createdDate).format(dateFormat) : null}</Description>
            </DescriptionList>
          </Col>
          <Col span={8}>
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="Stock Take List No">{data.stockTakeListNumber}</Description>
              <Description term="Status">{renderStockTakeListStatusTag(data.status)}</Description>
            </DescriptionList>
          </Col>
        </Row>
      );
    }

    return (
      <PageHeaderLayout
        title={renderPageTitle()}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
      >
        <div className="content-inner">
          { loading
              ? (
            <div>
              <Card loading={loading} style={{ marginBottom: 20 }} />
              <Card loading={loading} />
            </div>
          ) : (
            <Card>
              { data.status === 'INCOMPLETE' && <StockTakeListForm {...stockTakeListFormProps} /> }
              { data.status === 'IN_PROCESS' && <StockTakeListForm {...stockTakeListFormProps} /> }
              { data.status === 'APPROVED' && <StockTakeListView {...stockTakeListViewProps} /> }
            </Card>
          )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default StockTakeListViewWrapper;
