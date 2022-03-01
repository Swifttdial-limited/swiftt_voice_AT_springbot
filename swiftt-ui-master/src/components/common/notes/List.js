import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {
  Table,
  Dropdown,
  Button,
  Menu,
  Icon,
  Modal,
  LocaleProvider,
  Input
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import styles from './List.less';

const { TextArea } = Input;
const confirm = Modal.confirm;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

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
      dataSource,
      pagination,
    } = this.props;

    const transform = (node, index) => {

      //  register all form components
      if (node.type === 'tag' && (node.name === 'input' || node.name === 'textarea')) {

        let finalElement = <Input key={node.attribs.id} disabled value={node.attribs.value} />
        if(node.name === 'textarea') {
          finalElement = <TextArea key={node.attribs.id}  disabled rows={node.attribs.rows ? node.attribs.rows : 2} value={node.attribs.value} />
        }

        return finalElement;
      }

    }

    const options = {
      decodeEntities: true,
      transform
    };

    // TODO note to have title i.e. Name of Template or User can define
    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: 'Author',
        dataIndex: 'author.fullName',
        key: 'author.fullName',
      }, {
        title: 'Date',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).format(dateTimeFormat)}</span>,
      }, {
        title: 'Published',
        dataIndex: 'publishable',
        key: 'publishable',
        render: text => <span>{text ? 'Yes' : 'No'}</span>,
      }, {
        title: 'Open',
        dataIndex: 'open',
        key: 'open',
        render: text => <span>{text ? 'Yes' : 'No'}</span>,
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <Dropdown overlay={<Menu onClick={this.handleMenuClick.bind(null, record)}>
              <Menu.Item key="1">Edit</Menu.Item>
              <Menu.Item key="2">Delete</Menu.Item>
            </Menu>}
            >
              <Button style={{ border: 'none' }}>
                <Icon style={{ marginRight: 2 }} type="bars" />
                <Icon type="down" />
              </Button>
            </Dropdown>
          );
        },
      },
    ];

    const expandedRowRender = (record) => {
      if (record.body) {
        return (
          <div style={{ textAlign: 'left' }}>
            { ReactHtmlParser(record.body, options) }
          </div>
        );
      } else {
        return null;
      }
    };

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
            expandedRowRender={expandedRowRender}
            scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

export default List;
