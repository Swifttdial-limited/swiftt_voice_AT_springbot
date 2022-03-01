import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Table,
  Dropdown,
  Button,
  Menu,
  Icon,
  Modal,
  LocaleProvider,
  Tag
} from 'antd';
import Ellipsis from '../../Ellipsis';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';
const confirm = Modal.confirm;

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

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

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

  handleMenuClick = (record, e) => {
    const { onCancelAppointment, onConfirmAppointment, onEditItem } = this.props;
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure you want to cancel this appointment?',
        onOk() {
          onCancelAppointment(record);
        },
      });
    } else if (e.key === '3') {
      confirm({
        title: 'Are you sure you want to confirm this appointment?',
        onOk() {
          onConfirmAppointment(record);
        },
      });
    }
  }

  render() {
    const {
      loading,
      dataSource,
      pagination,
    } = this.props;

    const renderAppointmentStatusTag = (status) => {
      switch (status) {
        case 'WAITING':
          return <Tag color="orange">WAITING</Tag>;
        case 'ON_GOING':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CANCELLED':
          return <Tag color="red">CANCELLED</Tag>;
        case 'COMPLETED':
          return <Tag color="magenta">COMPLETED</Tag>;
        case 'SCHEDULED_AND_NEEDS_CONFIRMATION':
          return <Tag color="blue">NEEDS CONFIRMATION</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Date',
        dataIndex: 'appointmentDate',
        key: 'appointmentDate',
        render: text => <span>{moment(text).format(dateFormat)}</span>,
      }, {
        title: 'Start - End Time',
        dataIndex: 'proposedStartTime',
        key: 'proposedStartTime',
        render: (text, record) => <span>{record.proposedStartTime} - {record.proposedEndTime}</span>
      }, {
        title: 'Appointment Type',
        dataIndex: 'appointmentType.name',
        key: 'appointmentType.name',
        render: (text, record) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Department',
        dataIndex: 'assignedDepartment.name',
        key: 'assignedDepartment.name',
        render: (text, record) => <Ellipsis lines={1}>{text}</Ellipsis>,
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => renderAppointmentStatusTag(text)
      }, {
        title: '',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return (
            <span className="table-operation">
              <Dropdown overlay={<Menu onClick={this.handleMenuClick.bind(null, record)}>
                  <Menu.Item key="1">Edit</Menu.Item>
                  { record.status === 'SCHEDULED_AND_NEEDS_CONFIRMATION' && (<Menu.Item key="3">Confirm</Menu.Item>)}
                  <Menu.Item key="2">Cancel</Menu.Item>
                </Menu>}>
                <a href="javascript:;">
                  More <Icon type="down" />
                </a>
              </Dropdown>
            </span>
          );
        },
      },
    ];

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            className={styles.table}
            bordered
            size="middle"
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

export default List;
