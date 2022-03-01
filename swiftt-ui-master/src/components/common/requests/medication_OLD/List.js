import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const confirm = Modal.confirm;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD HH:mm:ss';

class List extends PureComponent {
  constructor(props) {
    super(props);
    const { current } = this.props.pagination;
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
  }

  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem } = this.props;
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure you want to delete this record?',
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
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
      dataSource,
      pagination,
      onDeleteItem,
      onEditItem,
      type,
    } = this.props;

    const renderRequestStatusTag = (status) => {
      switch (status) {
        case 'NEW':
          return <Tag color="magenta">NEW</Tag>;
        case 'ACTIVE':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CANCELLED':
          return <Tag color="red">CANCELLED</Tag>;
        case 'COMPLETED':
          return <Tag color="magenta">COMPLETED</Tag>;
        case 'AWAITING_CONFIRMATION':
          return <Tag color="purple">AWAITING CONFIRMATION</Tag>;
        case 'PENDING_BILL_PAYMENT':
          return <Tag color="purple">PENDING BILL PAYMENT</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    let columns = [];

    if (type === 'summary') {
      columns = [
        {
          title: 'Queue No.',
          dataIndex: 'requestNumber',
          key: 'requestNumber',
        }, {
          title: 'Request Time',
          dataIndex: 'creationDate',
          key: 'creationDate',
          render: (text) => <span>{moment(text).format(dateTimeFormat)}</span>,
        }, {
          title: 'Requesting Dept',
          dataIndex: 'sourceDepartment.name',
          key: 'sourceDepartment.name',
        }, {
          title: 'Destination Dept',
          dataIndex: 'destinationDepartment.name',
          key: 'destinationDepartment.name',
        }, {
          title: 'Request By',
          dataIndex: 'createdBy.fullName',
          key: 'createdBy.fullName',
        }, {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => <span>{renderRequestStatusTag(text)}</span>,
        },
      ];
    } else if (type === 'full') {
      columns = [
        {
          title: 'Queue No.',
          dataIndex: 'requestNumber',
          key: 'requestNumber',
          sorter: true,
        }, {
          title: 'Visit No.',
          dataIndex: 'visit.visitNumber',
          key: 'visit.visitNumber',
          sorter: true,
          render(text, record) {
            return {
              props: {
                style: { background: record.visit.visitType.colorCode, color: record.visit.visitType.colorCode ? '#FFFFFF' : null },
              },
              children: <div>{text}</div>,
            };
          },
        }, {
          title: 'Patient',
          dataIndex: 'visit.patient.user.fullName',
          key: 'visit.patient.user.fullName',
        }, {
          title: 'Request Time',
          dataIndex: 'creationDate',
          key: 'creationDate',
          sorter: true,
          render: (text) => <span>{moment(text).format(dateTimeFormat)}</span>,
        }, {
          title: 'Triage Cat.',
          dataIndex: 'visit.triageCategory.name',
          key: 'visit.triageCategory.name',
        }, {
          title: 'Requesting Dept',
          dataIndex: 'sourceDepartment.name',
          key: 'sourceDepartment.name',
        }, {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => <span>{renderRequestStatusTag(text)}</span>,
        }, {
          title: '',
          key: 'operation',
          render: (text, record) => <Link to={`/workspace/request/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
        },
      ];
    }


    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            className={type === 'summary' ? styles.summary_table : styles.full_table}
            bordered
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            onChange={::this.pageChange}
            pagination={pagination}
            simple
            rowKey={record => record.id}
            scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

List.defaultProps = {
  type: 'summary',
};

List.propTypes = {
  type: PropTypes.string.isRequired,
};

export default List;
