import React, { PureComponent } from 'react'
import { routerRedux, Link } from 'dva/router'
import moment from 'moment'
import {
  Table,
  Dropdown,
  Button,
  Menu,
  Icon,
  Modal,
  LocaleProvider,
  Tag
} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

import styles from './List.less'

const confirm = Modal.confirm

const dateTimeFormat = 'YYYY-MM-DD HH:mm'
const ageDateFormat = 'YYYY, M, DD'

class List extends PureComponent {
  constructor (props) {
    super(props)
    const { current } = this.props.pagination
    this.currentPage = current
    this.newPage = current
    this.state = {
      width: 800
    }
  }

  /**
   * Add event listener
   */
  componentDidMount () {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions.bind(this))
  }

  /**
   * Remove event listener
   */
  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions.bind(this))
  }

  onEnd = e => {
    e.target.style.height = 'auto'
  }

  _handleRowClick = (record, e) => {
    const { onViewItem } = this.props
    onViewItem(record)
  }

  async pageChange (pagination) {
    await this.props.onPageChange(pagination)
    this.newPage = pagination.current
  }

  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions () {
    if (window.innerWidth < 1000) {
      this.setState({ width: 850 })
    } else if (window.innerWidth > 1000) {
      this.setState({ width: 0 })
    } else {
      const updateWidth = window.innerWidth - 100
      this.setState({ width: updateWidth })
    }
  }

  render () {
    const { loading, dataSource, pagination, onViewItem } = this.props

    const renderVisitStatusTag = status => {
      switch (status) {
        case 'NEW':
          return <Tag color='magenta'>NEW</Tag>
        case 'ACTIVE':
          return <Tag color='green'>IN PROGRESS</Tag>
        case 'CLOSED':
          return <Tag color='red'>CLOSED</Tag>
        case 'AWAITING_CONFIRMATION':
          return <Tag color='purple'>AWAITING CONFIRMATION</Tag>
        case 'PENDING_ADMISSION':
          return <Tag color='purple'>PENDING ADMISSION</Tag>
        case 'PENDING_PAYMENT':
          return <Tag color='purple'>PENDING PAYMENT</Tag>
        case 'PENDING_BILL_PAYMENT':
          return <Tag color='purple'>PENDING BILL PAYMENT</Tag>
        case 'PENDING_DISCHARGE':
          return <Tag color='purple'>PENDING DISCHARGE</Tag>
        default:
          return <Tag color='blue'>{status}</Tag>
      }
    }

    const columns = [
      {
        title: 'Visit No.',
        dataIndex: 'visitNumber',
        key: 'visitNumber',
        render (text, record) {
          return {
            props: {
              style: {
                background: record.visitType.colorCode
                  ? record.visitType.colorCode
                  : null,
                color: record.visitType.colorCode ? '#FFFFFF' : null
              }
            },
            children: (
              <div>
                {record.visitType.prefix ? record.visitType.prefix + '-' : null}
                {text}
              </div>
            )
          }
        }
      },
      {
        title: 'Name',
        dataIndex: 'patient.user.fullName',
        key: 'patient.user.fullName'
      },
      {
        title: 'MRN / OTC No.',
        dataIndex: 'patient.medicalRecordNumber',
        key: 'patient.medicalRecordNumber'
      },
      {
        title: 'Visit Type',
        dataIndex: 'visitType.name',
        key: 'visitType.name'
      },
      {
        title: 'Visit Time',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => (
          <span>
            {moment(text)
              .local()
              .format(dateTimeFormat)}
          </span>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => <span>{renderVisitStatusTag(text)}</span>
      },
      {
        title: '',
        key: 'operation',
        render: (text, record) => (
          <Link to={`/visit/view/${record.id}`}>
            <Icon type='eye-o' style={{ fontSize: 20 }} />
          </Link>
        )
      }
    ]

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            className={styles.table}
            bordered
            size='middle'
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
    )
  }
}

export default List
