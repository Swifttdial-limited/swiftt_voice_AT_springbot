import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Dropdown,
  Button,
  Icon,
  Table,
  Popconfirm,
  Alert,
  Tag,
  Card
} from 'antd';
import numeral from 'numeral';

import LocationSelect from '../../common/LocationSelect';
import Authorized from '../../../utils/Authorized';
import DescriptionList from '../../DescriptionList';
import RequestTemplateView from './requestItem/RequestItemTemplatesView';

const { Description } = DescriptionList;
let dataSource = {};

@connect(({ request, requestItems }) => ({
  request,
  requestItems,
}))
class RequestDetail extends PureComponent {

  static propTypes = {
    request: PropTypes.object.isRequired,
    requestItems: PropTypes.object,
  };

  state = {
    selectedRowKeys: [],
    selectedRows: [],
    activeRequestItem: {},
    activeRequestItemKey: null,
    showDetailView: false,
  };

  componentDidMount() {
    const { dispatch, request } = this.props;
    dispatch({ type: 'requestItems/query', payload: { id: request.data.id } });
  }

  postRequestToBilling = () => {
    const { selectedRows } = this.state;
    let payload = [];

    selectedRows.forEach((selectedRow) => {
      if (selectedRow.priceListItem.product.productType === 'STOCK' && selectedRow.location === null) {
        console.log('Tupa error');
      } else {
        let entry = { requestItem: { ...selectedRow } }

        if (selectedRow.location != undefined)
          entry.location = selectedRow.location;

        payload.push(entry);
      }
    });
    this.props.dispatch({
      type: 'bills/postRequestItemToBills',
      payload: {
        requestId: this.props.request.data.id,
        actionType: 'POST_TO_BILL',
        requestItems: payload,
      },
    });
  }

  locationSelectHandler = (value, currentRequestItem) => {
    dataSource = dataSource.map((requestItem) => {
      if (requestItem.id === currentRequestItem.id) {
        requestItem.location = value;
      }
      return requestItem;
    })
  };

  render() {
    const { dispatch, request, requestItems, isPreviousVisit } = this.props;
    const { loading, success } = requestItems;
    const { selectedRowKeys, showDetailView, activeRequestItem, activeRequestItemKey } = this.state;
    const activeRequest = request.data;
    const hasSelectedRequestForBilling = selectedRowKeys.length > 0;

    dataSource = (requestItems[activeRequest.id] ? requestItems[activeRequest.id] : []);

    const locationSelectProps = {
      department: activeRequest.destinationDepartment.publicId,
      multiSelect: false,
      isStore: true,
    };

    const requestItemTemplateProps = {
      activeRequest,
      // requestItem: activeRequestItem,
      // activeRequestItemId: activeRequestItem.id,
      requestId: activeRequest.id,
      handlePostResults: payload => handlePostResults(payload),
    };

    const handleExpandedRowRender = (requestItem) => {

      // get view for product tempalate
      if (requestItem.priceListItem.product.productType === 'SERVICE') {

        if (requestItem.status === 'ACTIVE' || requestItem.status === 'COMPLETED') {

          const data = {
            ...requestItemTemplateProps,
            requestItem,
            requestId: activeRequest.id,
            activeRequestItemId: requestItem.id,
          };
          return <RequestTemplateView {...data} />;
        } else {
          let message = 'An Error occured';
          if (requestItem.status === "NEW") {
            message = 'This request is not posted. Please post this Request';
          } else if (requestItem.status === "POSTED") {
            message = 'This request has been successfully posted. Awaiting Payment complete request.';
          } else if (requestItem.status === "CANCELLED") {
            message = 'This request has been cancelled.';
          }
          return (
            <div>
              <Alert message="Info" description={message} type="info" showIcon />
            </div>
          );
        }

      } else if (requestItem.priceListItem.product.productType === 'MEDICATION' || requestItem.priceListItem.product.productType === 'SUPPLIES') {
        return (
          <div>
          {requestItem.status === 'ACTIVE' && (
            <Fragment>
              <LocationSelect
                onLocationSelect={(value) => this.locationSelectHandler(value, requestItem)}
                {...locationSelectProps}
              />
              <Button
                onClick={() => handlePostResults({
                  actionType: 'FULFILL',
                  location: requestItem.location,
                  requestItemId: requestItem.id,
                  requestId: activeRequest.id,
                })}
                disabled={requestItem.status !== 'ACTIVE' }>Dispense</Button>
            </Fragment>
            )}

            {requestItem.status === 'COMPLETED' && (
              <Fragment>
                <Button
                  onClick={() => handleReversal({
                    actionType: 'REVERSE',
                    requestItemId: requestItem.id,
                    requestId: activeRequest.id,
                  })}
                  disabled={requestItem.status !== 'COMPLETED' }>Return</Button>
              </Fragment>
              )}
          </div>
        );
      }
    };

    const handlePostResults = (payload) => {
      dispatch({ type: 'templateInvestigations/actions', payload });
    };

    const handleReversal = (payload) => {
      dispatch({ type: 'templateInvestigations/actions', payload });
    };

    const renderRequestStatusTag = (status) => {
      switch (status) {
        case 'NEW':
          return <Tag color="blue">NEW</Tag>;
        case 'ACTIVE':
          return <Tag color="purple">IN PROGRESS</Tag>;
        case 'CANCELLED':
          return <Tag color="red">CANCELLED</Tag>;
        case 'COMPLETED':
          return <Tag color="green">COMPLETED</Tag>;
        default:
          return <Tag color="magenta">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Name',
        dataIndex: 'priceListItem.product.productName',
        key: 'priceListItem.product.productName',
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: text => renderRequestStatusTag(text),
      }, {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'right',
      }, {
        title: 'Price',
        dataIndex: 'priceListItem.sellingPrice',
        key: 'priceListItem.sellingPrice',
        align: 'right',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>
      }, {
        title: 'Total',
        dataIndex: 'payableTotal',
        key: 'payableTotal',
        align: 'right',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>
      },
      // {
      //   title: 'Fulfilled',
      //   dataIndex: 'fulfilled',
      //   key: 'fulfilled',
      //   render: text => (
      //     <Tag color={text ? 'green' : 'blue'}>{text ? 'Complete' : 'Pending' }</Tag>
      //   ),
      // }
    ];

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
      getCheckboxProps: record => ({// Column configuration not to be checked
        disabled: (record.status !== 'NEW'),
        defaultChecked: (record.status !== 'NEW'),
      }),
    };



    return (
      <Authorized authority="READ_REQUESTS">
        {!isPreviousVisit && (
          <div>
            <Button
              onClick={this.postRequestToBilling}
              disabled={!hasSelectedRequestForBilling}
            >
              Post Selected Items
            </Button>

            <Table
              bordered
              dataSource={dataSource}
              rowKey={record => record.id}
              rowSelection={rowSelection}
              columns={columns}
              size="medium"
              pagination={false}
              expandedRowRender={(record) => handleExpandedRowRender(record)}
              // onRow={(record) => {
              //   return {
              //     onClick: () => this.viewRequestItemDetails(record),
              //   };
              // }}
              loading={loading}
            />
          </div>
        )}
        {isPreviousVisit && (
          <div>
            <Alert message="Info" description="You are accessing a previous visit, which does not have any active action to be undertaken.
            You can view patient previous visit requests from the Investigation menu item" type="info" showIcon />
          </div>
        )}
      </Authorized>
    );
  }
}

export default RequestDetail;
