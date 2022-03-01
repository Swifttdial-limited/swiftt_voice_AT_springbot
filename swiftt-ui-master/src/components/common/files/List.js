import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import Ellipsis from '../../Ellipsis';
import { Button, Table, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './index.less';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

class FilesList extends PureComponent {

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

  handleDownloadFileClick = (fileMetadata) => {
    const { onDownloadFile } = this.props;
    onDownloadFile(fileMetadata);
  }

  handleDeleteFileClick = (fileMetadata) => {
    const { onDeleteFile } = this.props;
    onDeleteFile(fileMetadata);
  }

  render() {
    const {
      loading,
      dataSource,
      pagination,
      onDownloadFile,
      onDeleteFile,
      readOnly,
    } = this.props;

    const columns = [{
      title: 'Filename',
      dataIndex: 'originalFilename',
      key: 'originalFilename',
      render: (text, record) => <Ellipsis lines={1}>{text}</Ellipsis>,
    }, {
      title: 'Upload Date',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: text => <span>{moment(text).format(dateTimeFormat)}</span>,
    }, {
      title: 'Uploaded By',
      dataIndex: 'createdBy.fullName',
      key: 'createdBy.fullName',
    }, {
      title: '',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="primary" shape="circle" icon="download" size="small" onClick={() => this.handleDownloadFileClick(record)} style={{ marginRight: 10 }}/>
          {!readOnly && (
            <Button type="danger" shape="circle" icon="delete" size="small" onClick={() => this.handleDeleteFileClick(record)} />
          )}
        </span>
      ),
    }];

    return (
      <LocaleProvider locale={enUS}>
        <Table
          className={styles.table}
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={::this.pageChange}
          pagination={pagination}
          simple
          rowKey={record => record.id}
          scroll={{ x: this.state.width }} />
      </LocaleProvider>
    );
  }
}

export default FilesList;
