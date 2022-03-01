import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Tag, Icon, Avatar, Modal, Divider, Card } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PatientVisitDetailsCard from '../../common/encounters/PatientVisitDetailsCard';
import RequestDescription from '../../common/requests/RequestDescription';
import RequestDetail from '../request/Detail';
import RequestItemsList from '../../common/requests/RequestItemsList';
import SummarizedTaskToolbar from '../../../components/workspace/task/SummarizedTaskToolbar';

const { confirm } = Modal;

@connect(({ task, loading }) => ({
  task,
  loading: loading.effects['task/query'],
}))
class SummarizedTaskView extends PureComponent {

  static defaultProps = {
    loading: false,
  };

  static propTypes = {
    loading: PropTypes.bool,
    task: PropTypes.object,
  }

  claimTaskHandler = () => {
    const { dispatch, task } = this.props;
    dispatch({ type: 'request/claim', payload: { id: task.data.id } });
  }

  unclaimTaskHander = () => {
    const { dispatch, task } = this.props;
    dispatch({ type: 'request/unclaim', payload: { id: task.data.id } });
  }

  goToTaskViewHandler = () => {
    const { dispatch, task } = this.props;
    dispatch(routerRedux.push(`/workspace/request/${task.data.id}`));
  }

  render() {
    const { loading, task } = this.props;
    const { data } = task;

    return (
      <div>
        { loading  && <Card loading /> }
        { !loading && data.id &&
          <div style={{ padding: 10 }}>
            <SummarizedTaskToolbar
              department={data.destinationDepartment.name}
              description={data.requestNumber}
              assignedTo={data.assignedUser}
              status={data.status}
              onClaim={this.claimTaskHandler}
              onUnclaim={this.unclaimTaskHander}
              onOpen={this.goToTaskViewHandler} />
            <RequestDescription request={data} />
            <Divider />
            <PatientVisitDetailsCard encounter={data.visit}  request={data}/>
            <Divider />
            <RequestItemsList request={data} />
          </div>
        }
      </div>
    );
  }
}

export default SummarizedTaskView;
