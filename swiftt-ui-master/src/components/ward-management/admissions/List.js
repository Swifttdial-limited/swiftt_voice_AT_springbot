import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import { filter } from 'lodash';
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
        case 'ACTIVE':
          return <Tag color="green">ACTIVE</Tag>;
        case 'CLOSED':
          return <Tag color="red">CLOSED</Tag>;
        case 'PENDING':
          return <Tag color="purple">PENDING</Tag>;
        case 'CANCELED':
          return <Tag color="purple">CANCELED</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const renderContent = (text, record) => {
      const currentBedOccupation = filter(record.bedOccupations, ['current', true])[0];

      if (currentBedOccupation) { return <span>{currentBedOccupation.bed.name} ({currentBedOccupation.bed.ward.name})</span>; } else { return null; }
    };

    const columns = [
      {
        title: 'Adm. No.',
        dataIndex: 'admissionNumber',
        key: 'admissionNumber',
      }, {
        title: 'Adm. Time',
        dataIndex: 'admissionDate',
        key: 'admissionDate',
        render: text => <span>{moment(text).local().format(dateTimeFormat)}</span>,
      }, {
        title: 'Bed (Ward)',
        dataIndex: 'bedOccupations',
        key: 'bedOccupations',
        render: renderContent,
      }, {
        title: 'Patient',
        dataIndex: 'visit.patient.user.fullName',
        key: 'visit.patient.user.fullName',
      }, {
        title: 'MRN No.',
        dataIndex: 'visit.patient.medicalRecordNumber',
        key: 'visit.patient.medicalRecordNumber',
      }, {
        title: 'Visit Time',
        dataIndex: 'visit.creationDate',
        key: 'visit.creationDate',
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
