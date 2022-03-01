import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, LocaleProvider, Tag } from 'antd';
import numeral from 'numeral';
import enUS from 'antd/lib/locale-provider/en_US';

@connect(({ requestItems, loading }) => ({
  requestItems,
  loading: loading.effects['requestItems/query'],
}))
class RequestItemsList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      width: 800,
    };
  }

  componentDidMount() {
    const { dispatch, request } = this.props;

    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));

    dispatch({ type: 'requestItems/query', payload: { id: request.id } });
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  onEnd = (e) => {
    e.target.style.height = 'auto';
  }

  async pageChange(pagination) {
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }

  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions() {
    if (window.innerWidth < 1000) {
      this.setState({ width: 850 });
    } else if (window.innerWidth > 1000) {
      this.setState({ width: 0 });
    } else {
      const updateWidth = window.innerWidth - 100;
      this.setState({ width: updateWidth });
    }
  }

  render() {
    const {
      loading,
      requestItems,
      request
    } = this.props;

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
    ];

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            dataSource={requestItems[request.id]}
            rowKey={record => record.id}
            columns={columns}
            pagination={false}
            loading={loading}
            // size="small"
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default RequestItemsList;
