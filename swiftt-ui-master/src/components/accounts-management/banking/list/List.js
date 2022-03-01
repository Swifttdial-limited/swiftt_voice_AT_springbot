import React, { PureComponent } from 'react';
// eslint-disable-next-line camelcase
import enGb from 'antd/lib/locale-provider/en_GB';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table, Icon, Modal, LocaleProvider, Tag } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { connect } from 'dva/index';
import BankingDetail from '../detail';
import numeral from 'numeral';

const { confirm } = Modal;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const displayDateFormat = 'DD MMM YYYY';

@connect(({ banking, loading }) => ({
  banking,
  loading: loading.effects['banking/query'],
}))

class JournalReferenceList extends PureComponent {
  constructor(props) {
    super(props);
    this.enterAnim = [
      {
        opacity: 0,
        x: 30,
        backgroundColor: '#fffeee',
        duration: 0,
      }, {
        height: 0,
        duration: 200,
        type: 'from',
        delay: 250,
        ease: 'easeOutQuad',
        onComplete: this.onEnd,
      }, {
        opacity: 1,
        x: 0,
        duration: 250,
        ease: 'easeOutQuad',
      }, {
        delay: 1000,
        backgroundColor: '#fff',
      },
    ];
    this.leaveAnim = [
      {
        duration: 250,
        opacity: 0,
      }, {
        height: 0,
        duration: 200,
        ease: 'easeOutQuad',
      },
    ];
    const { current } = this.props.banking.pagination;
    this.currentPage = current;
    this.newPage = current;
    this.state = {
      width: 800,
    };
  }

  /**
   * Add event listener
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }
  onEnd = (e) => {
    e.target.style.height = 'auto';
  };

  getBodyWrapper = (body) => {
    // Switch paging to remove animation
    if (this.currentPage !== this.newPage) {
      this.currentPage = this.newPage;
      return body;
    }
    return (
      <TweenOneGroup
        component="tbody"
        className={body.props.className}
        enter={this.enterAnim}
        leave={this.leaveAnim}
        appear={false}
      >
        {body.props.children}
      </TweenOneGroup>
    );
  };

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

  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem } = this.props;
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure you want to delete this record?',
        onOk() {
          onDeleteItem(record.publicId);
        },
      });
    }
  };

  async pageChange(pagination) {
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
  }
  handleTableChange = (pagination, filters, sorter) => {

    this.props.onTableChange(pagination, filters, sorter);
  }

  handleExpandedRowRender = (record) => {
    return (
      <BankingDetail journalReference={record} />
    );
  };

  render() {
    const { list, pagination, success, loading } = this.props.banking;

    const columns = [
      {
        title: 'Cheque No',
        dataIndex: 'transactionNumber',
        key: 'transactionNumber',
        width: '15%',
      },
      {
        title: 'Type',
        dataIndex: 'transactionType',
        key: 'transactionType',
        width: '10%',
        align:'center',
        // filters: [
        //   { text: 'Deposit', value: 'BANKING_DEPOSIT' },
        //   { text: 'Withdrawal', value: 'BANKING_WITHDRAW' },
        // ],
        // filterMultiple: false,
        render: (text) => {
          if (text === 'BANKING_DEPOSIT') {
            return <Tag color="blue">DEPOSIT</Tag>;
          } else if (text === 'BANKING_WITHDRAW') {
            return <Tag color="magenta">WITHDRAW</Tag>;
          }
        },
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '20%',
      }, {
        title: ' Date',
        dataIndex: 'journalDate',
        sorter: true,
        key: 'journalDate',
        width: '10%',
        render: text => (
          <span>{moment(text)
            .format(displayDateFormat)}
          </span>
        ),
      }, {
        title: 'Created By',
        dataIndex: 'createdBy.fullName',
        key: 'createdBy.fullName',
        width: '15%',
      }, {
        title: 'Created Date',
        dataIndex: 'creationDate',
        sorter: true,
        key: 'creationDate',
        width: '15%',
        render: text => (
          <span>{moment(text)
            .format(displayDateFormat)}
          </span>
        ),
      },
      {
        title: 'Total',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        width: '10%',
        align: 'right',
        render: (text, record) => <span>{numeral(text).format('0,0.00')}</span>,
      },
    ];

    return (
      <div>
        <LocaleProvider locale={enGb}>
          <Table
            columns={columns}
            loading={loading}
            dataSource={list}
            size="middle"
            pagination={false}
            rowKey={record => record.id}
            scroll={{ y: '70vh' }}
            onChange={this.handleTableChange}
            expandedRowRender={record => this.handleExpandedRowRender(record)}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default JournalReferenceList;
