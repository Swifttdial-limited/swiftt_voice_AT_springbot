import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Table, Dropdown, Button, Menu, Icon, Modal, LocaleProvider, Tag } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';
import styles from './List.less';

const confirm = Modal.confirm;

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

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

  _handleRowClick = (record, e) => {
    const { onViewItem } = this.props;
    onViewItem(record);
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
      onViewItem,
    } = this.props;

    const renderAdmissionStatusTag = (status) => {
      switch (status) {
        case 'PENDING':
          return <Tag color="magenta">PENDING</Tag>;
        case 'ACTIVE':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CLOSED':
          return <Tag color="red">CLOSED</Tag>;
        case 'CANCELED':
          return <Tag color="purple">CANCELED</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Admission No.',
        dataIndex: 'admissionNumber',
        key: 'admissionNumber',
      }, {
        title: 'Name',
        dataIndex: 'visit.patient.user.fullName',
        key: 'visit.patient.user.fullName',
      }, {
        title: 'MRN No.',
        dataIndex: 'visit.patient.medicalRecordNumber',
        key: 'visit.patient.medicalRecordNumber',
      }, {
        title: 'Visit No',
        dataIndex: 'visit.visitNumber',
        key: 'visit.visitNumber',
      }, {
        title: 'Visit Time',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).local().format(dateTimeFormat)}</span>,
      }, {
        title: 'Triage Cat.',
        dataIndex: 'visit.triageCategory.name',
        key: 'visit.triageCategory.name',
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => <span>{renderAdmissionStatusTag(text)}</span>,
      }, {
        title: '',
        key: 'operation',
        render: (text, record) => <Link to={`/admission/view/${record.id}`}><Icon type="eye-o" style={{ fontSize: 20 }} /></Link>,
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
