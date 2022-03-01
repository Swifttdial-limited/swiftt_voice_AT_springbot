import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Icon,
  Row,
  Col,
  List,
  Avatar,
  Table,
  Button,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import { chain, filter, find, get, groupBy, sortBy, sumBy } from 'lodash';
import enUS from 'antd/lib/locale-provider/en_US';

import Authorized from '../../../utils/Authorized';
import DepositModal from '../patient-deposits/Modal';
import { query } from '../../../services/billing-management/depositRequests'

const dateFormat = 'YYYY-MM-DD';

@connect(({ deposits }) => ({
  deposits,
}))
class PatientDepositRequestsView extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func,
  };

  state = {
    groupedRequests: [],
    loading: false,
    requests: [],
    selectedGroupedItem: {},
    selectedRows: [],
  };

  componentDidMount() {
    this.fetchPendingDepositRequests();
  }

  fetchPendingDepositRequests = () => {
    this.setState({ loading: true });

    query({
      processed: false,
      status: 'UNPAID',
      size: 100,
    }).then((response) => {

      const grouped = chain(response.content)
      .sortBy('addressTo.name')
      .groupBy('addressTo.id')
      .map(function(v, i) {
        const r = filter(v, ['addressTo.id', i]);
        return {
          id: i,
          name: get(find(v, 'addressTo.name'), 'addressTo.name'),
          code: get(find(v, 'addressTo.code'), 'addressTo.code'),
          total: sumBy(r, 'depositDefinition.requiredDepositAmount'),
          requests: r,
        }
      }).value();

      this.setState({ groupedRequests: grouped, requests: response.content, loading: false });
    }).catch((e) => {
      this.setState({ groupedRequests: [], requests: [], loading: false });
    });
  }

  handleGroupedAddressToClick = (item) => {
    this.setState({ selectedGroupedItem: item });
  }

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    const { requests } = this.state;

    selectedRows.forEach((selectedRow) => {
      requests.forEach((item) => {
        if (selectedRow.id === item.id) {
          item.approved = true;
        }
      });
    });

    // TODO calculate total deposit

    this.setState({
      selectedRows,
      requests,
    });
  };

  onDepositModalShow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deposits/showModal',
      payload: {
        modalType: 'create',
      },
    });
  }

  render() {
    const { deposits, dispatch } = this.props;
    const { modalVisible } = deposits;

    const { loading, groupedRequests, requests, selectedGroupedItem, selectedRows } = this.state;

    const totalDepositAmount = sumBy(selectedRows, 'depositDefinition.requiredDepositAmount');

    const depositModalProps = {
      item: { depositRequests: selectedRows, total: totalDepositAmount },
      type: 'create',
      visible: modalVisible,
      onOk(values) {
        const payload = {
          addressTo: {
            id: selectedGroupedItem.id,
            name: selectedGroupedItem.name,
            code: selectedGroupedItem.code,
          },
          ...values
        }
        dispatch({ type: 'deposits/create', payload: payload });
      },
      onCancel() {
        dispatch({ type: 'deposits/hideModal' });
      },
    };

    const renderAvatar = (item) => {
      if (item) {
        return (
          <Avatar size="large" shape="square">
            {item.name[0]}
          </Avatar>
        );
      }
    }

    const renderCardTitle = (item) => {
      if (item.name) {
        let name = item.name;
        if (item.code)
          name += ' (' + item.code + ')'
        return name;
      }
      return null;
    }

    const renderCardDescription = (item) => {
      return null;
    }

    const columns = [
      {
        title: '#',
        dataIndex: 'depositRequestNumber',
        key: 'depositRequestNumber',
      }, {
        title: 'Requesting Department',
        dataIndex: 'department.name',
        key: 'department.name',
      }, {
        title: 'Type',
        dataIndex: 'depositDefinition.name',
        key: 'depositDefinition.name',
      }, {
        title: 'Requested Amount',
        dataIndex: 'depositDefinition.requiredDepositAmount',
        key: 'depositDefinition.requiredDepositAmount',
        align: 'right',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>,
      }, {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
      }, {
        title: 'Request Date',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).local().format(dateFormat)} </span>,
      }, {
        title: 'Request By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
      },
    ];

    const footer = () => (
      <Row>
        <Col span={8} offset={16} style={{ textAlign: 'right', fontWeight: 'bold', color: '#FFFFFF' }}>
          Total: {numeral(totalDepositAmount).format('0,0.00')}
        </Col>
      </Row>
    );

    const rowSelection = {
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: record.processed, // Column configuration not to be checked
        name: record.name,
      }),
    };

    const DepositModalGen = () => <DepositModal {...depositModalProps} />;

    return (
      <Row gutter={8}>
        <Col xs={24} md={8} lg={8}>
          <List
            loading={loading}
            size="small"
            header={<div>Deposit Requests ({groupedRequests.length})</div>}
            bordered={true}
            split
            dataSource={groupedRequests}
            renderItem={item => (
              <List.Item
                key={item.id}
                onClick={() => this.handleGroupedAddressToClick(item)}
                className={(selectedGroupedItem.id === item.id ? 'active selected' : '')}
              >
                <List.Item.Meta
                  avatar={renderAvatar(item)}
                  title={renderCardTitle(item)}
                  description={renderCardDescription(item)}
                />
                <div>
                  <span style={{ display: 'block', textAlign: 'right', padding: 5 }}>
                    Total: {numeral(item.total).format('0,0.00')}
                  </span>
                  <span style={{ display: 'block', textAlign: 'right', padding: 5 }}>
                    {moment(item.requests[0].creationDate).local().format(dateFormat)}
                  </span>
                </div>
              </List.Item>
            )}
          />
        </Col>
        <Col xs={24} md={16} lg={16}>
          <div>
            <Authorized authority="CREATE_PATIENT_DEPOSIT">
              <Button
                disabled={selectedRows && selectedRows.length == 0}
                type="primary"
                icon="plus"
                onClick={this.onDepositModalShow}>Receive Deposit</Button>
            </Authorized>

            <Table
              columns={columns}
              size="middle"
              footer={footer}
              rowKey={record => record.id}
              dataSource={selectedGroupedItem.requests}
              rowSelection={rowSelection}
            />
            <DepositModalGen />
          </div>
        </Col>
      </Row>
    );
  }
}

export default PatientDepositRequestsView;
