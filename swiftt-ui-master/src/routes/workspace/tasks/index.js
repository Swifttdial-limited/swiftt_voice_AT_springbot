import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Layout,
  Row,
  Col,
  Tag,
  List,
  Icon,
  Avatar,
  Button,
  Divider,
  Tooltip,
} from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import QueueAnim from 'rc-queue-anim';
import enUS from 'antd/lib/locale-provider/en_US';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import SummarizedTaskView from '../../../components/workspace/task/SummarizedTaskView';
import Toolbar from '../../../components/workspace/tasks/Toolbar';

import styles from './index.less';
const { Header, Content, Footer, Sider } = Layout;

const ageDateFormat = 'YYYY, M, DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const timeFormat = 'HH:mm';

@connect(({ tasks, loading, task }) => ({
  tasks,
  task,
  loading: loading.effects['tasks/query'],
}))
class TasksView extends PureComponent {

  static defaultProps = {
    loading: false,
  };

  static propTypes = {
    loading: PropTypes.bool,
    tasks: PropTypes.object,
  };

  state = {
    width: 800,
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));

    const { dispatch } = this.props;
    dispatch({ type: 'tasks/query' });
    dispatch({ type: 'task/purgeCurrentItem' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'task/purge' });
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

  taskClickHandler = (task) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'task/query',
      payload: { id: task.id },
    });
  }

  render() {
    const { dispatch, loading, tasks, task } = this.props;
    const { list, pagination } = tasks;
    const { data } = task;

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
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const toolbarProps = {
      filter: {},
      onFilterChange(value) {
        let payload = {};

        if (value.status && value.status !== 'ALL') {
          payload.status = value.status
        }

        if (value.startDate && value.endDate) {
          payload.startDate = value.startDate
          payload.endDate = value.endDate
        }

        if (value.assignedUsers.length > 0) {
          payload.assignedUsers = [];

          value.assignedUsers.forEach(function (user) {
            if (user != undefined)
              payload.assignedUsers.push(user.publicId);
          });
        }

        dispatch({ type: 'tasks/query', payload });
      },
    };

    const renderCardTitle = (item) => {
      if (item.visit.patient.user) {
        let title = item.visit.patient.user.fullName;
        if (item.visit.patient.medicalRecordNumber)
          title += ' (' + item.visit.patient.medicalRecordNumber + ')'

        return title;
      }
      return null;
    }

    const renderCardDescription = (item) => {
      if (item.sourceDepartment) {
        return 'From: ' + item.sourceDepartment.name + (item.visit.triageCategory ? ' (' + item.visit.triageCategory.name + ')' : '');
      }
      return null;
    }
    const renderAvatar = (item) => {
      if (item) {
        return (
          <div>
            <Tooltip placement="bottom" title={`Visit Type: ${item.visit.visitType.name}`}>
              <Avatar size="large" shape="square" style={{ backgroundColor: item.visit.visitType.colorCode }}>
                {item.requestNumber}
              </Avatar>
            </Tooltip>
          </div>
        );
      }
    }
    const workspaceActions = (
      <Link to={{
        pathname: "/patient/create",
        state: { registrationMethod: 'DEPARTMENT_REGISTERED' }
      }} >
        <Button
          type="primary"
          icon="user-add"
        >
          Walkin
       </Button>
      </Link>
    );

    return (
      <PageHeaderLayout
        action={workspaceActions}
        title={(sessionStorage.getItem('current_user') && JSON.parse(sessionStorage.getItem('current_user')).department ? `${JSON.parse(sessionStorage.getItem('current_user')).department.name} Workspace` : 'My Workspace')}
      // content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">

          <Row>
            <Toolbar {...toolbarProps} />
          </Row>
          <Divider />
          <Row gutter={8}>
            <Col span={8}>
              <div className="infinite-container encounters">
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  useWindow={false}>

                  <List
                    loading={loading}
                    size="small"
                    header={<div>Tasks ({list.length})</div>}
                    bordered={true}
                    split
                    dataSource={list}
                    renderItem={item => (
                      <QueueAnim
                        animConfig={[
                          { opacity: [1, 0], translateY: [0, 30] },
                          { height: 0 },
                        ]}
                        ease={['easeOutQuart', 'easeInOutQuart']}
                        duration={[550, 450]}
                        interval={150}
                      >
                        <List.Item

                          key={item.id}
                          onClick={() => this.taskClickHandler(item)}
                          className={(data && data.id === item.id ? 'active selected' : '')}
                        >
                          <List.Item.Meta
                            avatar={renderAvatar(item)}
                            title={renderCardTitle(item)}
                            description={renderCardDescription(item)}
                          />
                          <div>
                            <span style={{ display: 'block', textAlign: 'right', padding: 5 }}>
                              {renderRequestStatusTag(item.status)}
                            </span>
                            <span style={{ display: 'block', textAlign: 'right', padding: 5 }}>
                              {moment(item.creationDate).local().format(dateTimeFormat)}
                            </span>
                          </div>
                        </List.Item>
                      </QueueAnim>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </Col>
            <Col span={16}>
              <SummarizedTaskView />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default TasksView;
