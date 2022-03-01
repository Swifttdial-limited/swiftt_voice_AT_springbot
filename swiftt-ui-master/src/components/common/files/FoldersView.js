import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect} from 'dva';
import {
  Card,
  Table,
  Menu,
  Icon,
  Dropdown,
  Row,
  Col,
} from 'antd';
import { sortBy } from 'lodash';
import arrayToTree from 'array-to-tree';

import FolderModal from './FolderModal';
import FolderSearch from './Search';

@connect(({ folders, loading }) => ({
  folders,
  loading: loading.effects['folders/query'],
}))
class FoldersView extends PureComponent {

  static defaultProps = {
    onFolderSelect: () => {},
  };

  static propTypes = {
    onFolderSelect: PropTypes.func,
  }

  state = {
    foldersTree: [],
  };

  componentDidMount() {
    this.fetchFolders();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.folders && nextProps.folders.list) {
      this.setState({ foldersTree: this.generateTree(sortBy(nextProps.folders.list, ['folderName'])) });
    }
  }

  fetchFolders = (folder) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'folders/query',
    });
  }

  generateTree = (folders) => {
    return arrayToTree(folders, {
      parentProperty: 'parentFolder.id',
      customID: 'id',
    });
  }

  handleRootMenuClick = (e) => {
    const { dispatch } = this.props;

    if (e.key === '1') {
      dispatch({
        type: 'folders/showModal',
        payload: {
          modalType: 'create',
        },
      });
    } else if (e.key === '2') {
      this.fetchFolders();
    }
  }

  handleMenuClick = (record, e) => {
    const { dispatch, onDeleteItem, onEditItem } = this.props;
    if (e.key === '2') {
      dispatch({
        type: 'folders/showModal',
        payload: {
          modalType: 'update',
          currentItem: record,
        },
      });
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure you want to delete this record?',
        onOk() {
          onDeleteItem(record.publicId);
        },
      });
    }
  }

  render() {
    const { dispatch, folders, onFolderSelect } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = folders;

    const { foldersTree } = this.state;

    const folderModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `folders/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'folders/hideModal' });
      },
    };

    const folderSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 3) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'folders/query',
          payload: payload,
        });
      },
    };

    const titleContent = () => (
      <Row>
        <Col span={18}>
          <FolderSearch {...folderSearchProps} />
        </Col>
        <Col span={6}>
          <div style={{ textAlign: 'right' }}>
            <Dropdown overlay={<Menu onClick={this.handleRootMenuClick}>
                <Menu.Item key="1">New Folder</Menu.Item>
                <Menu.Item key="2">Refresh</Menu.Item>
              </Menu>}>
              <a href="javascript:;">
                Actions <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        </Col>
      </Row>
    );

    const columns = [{
      title: '',
      dataIndex: 'folderName',
      key: 'folderName',
    }, {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'right' }}>
            <Dropdown overlay={<Menu onClick={this.handleMenuClick.bind(null, record)}>
                <Menu.Item key="2">Edit</Menu.Item>
                <Menu.Item key="3">Delete</Menu.Item>
              </Menu>}>
              <a href="javascript:;">
                Actions <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        );
      },
    }];

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      type: "radio",
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        //console.log(record, selected, selectedRows);
        onFolderSelect(record);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        //console.log(selected, selectedRows, changeRows);
      },
    };

    const FolderModalGen = () => <FolderModal {...folderModalProps} />

    return(
      <div>
        <Table
          defaultExpandAllRows={true}
          rowSelection={rowSelection}
          title={titleContent}
          indentSize={5}
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={foldersTree}
          rowKey={record => record.id} />
        <FolderModalGen />
      </div>
    );
  }
}

export default FoldersView;
