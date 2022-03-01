import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Tag } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';

import Authorized from '../../../../utils/Authorized';
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import GoodsReturnForm from '../../../../components/inventory-management/goods-return/Form';
import GoodsReturnView from '../../../../components/inventory-management/goods-return/View';

import styles from './index.less';

const { Description } = DescriptionList;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD';

@connect(({ institutions, goodsReturn, loading }) => ({
  institutions,
  goodsReturn,
  loading: loading.effects['goodsReturn/query'],
}))
class GoodsReturnViewWrapper extends PureComponent {

  static propTypes = {
    goodsReturn: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/inventory/goods-return/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'goodsReturn/query', payload: { id: match[1] } });
    }
  }

  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'goodsReturn/purge' });
  // }

  goodsReturnGenerateHandler = () => {
    const { dispatch, goodsReturn } = this.props;
    const { data } = goodsReturn;

    dispatch(routerRedux.push('/inventory/goods-return/create'));
  }

  render() {
    const { dispatch, institutions, goodsReturn } = this.props;
    const { data, loading, success } = goodsReturn;

    const goodsReturnFormProps = {
      goodsReturn: data,
      onSave(values) {
        dispatch({ type: 'goodsReturn/save', payload: Object.assign({}, data, values) });
      },
      onSubmit(values) {
        dispatch({ type: 'goodsReturn/submit', payload: { id: data.id } });
      },
      onApprove(items) {
        dispatch({ type: 'goodsReturn/approve', payload: { id: data.id, items: items } });
      },
      onReject() {
        dispatch({ type: 'goodsReturn/reject', payload: { id: data.id } });
      },
    };

    const goodsReturnViewProps = {
      loading,
      success,
      goodsReturn: data,
    };

    const action = (
      <div>
        <Authorized authority="CREATE_GOODSS_RETURN">
          <Button icon="copy" onClick={this.goodsReturnGenerateHandler}>Create Goods Return</Button>
        </Authorized>
      </div>
    );

    const renderPageTitle = () => {
      switch (data.goodsReturnStatus) {
        case 'INCOMPLETE':
          return <span>Edit Goods Return</span>;
        default:
          return <span>Goods Return No: {data.goodsReturnNumber}</span>;
      }
    };

    const renderGoodsReturnStatusTag = (status) => {
      switch (status) {
        case 'INCOMPLETE':
          return <Tag color="grey">DRAFT</Tag>;
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
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="Created By">{data.createdBy.fullName}</Description>
          <Description term="Created At">{moment(data.createdDate).format(dateTimeFormat)}</Description>
          <Description term="Returned By">{data.returnedBy ? data.returnedBy.fullName : null}</Description>
          <Description term="Returned At">{data.returnDate ? moment(data.returnDate).format(dateFormat) : null}</Description>
          <Description term="Status">{renderGoodsReturnStatusTag(data.goodsReturnStatus)}</Description>
          <Description term="">&nbsp;</Description>
        </DescriptionList>
      );
    }

    return (
      <PageHeaderLayout
        title={renderPageTitle()}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
        action={action}
      >
        <div className="content-inner">
          {loading
            ? <Card loading={loading} />
            : (
              <Card>
                { data.goodsReturnStatus === 'INCOMPLETE' && <GoodsReturnForm {...goodsReturnFormProps} /> }
                { data.goodsReturnStatus === 'IN_PROCESS' && <GoodsReturnForm {...goodsReturnFormProps} /> }
                { data.goodsReturnStatus === 'APPROVED' && <GoodsReturnView {...goodsReturnViewProps} /> }
              </Card>
            )}
        </div>
      </PageHeaderLayout>
    );
  }
}

export default GoodsReturnViewWrapper;
