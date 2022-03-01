import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import {
  Popover,
  Steps,
  Card
} from 'antd';
import moment from 'moment';
// import { random } from '../../../utils/theme';
// import { getRandomInt, getTimeDistance } from '../../../utils/utils';
import { orderBy, isEmpty } from 'lodash';
const Step = Steps.Step;
const dateTimeFormat = 'YYYY-MM-DD';
const dateFormatDisplay = 'D MMM YYYY'

@connect(({ encounters, loading }) => ({
  encounters,
  loading: loading.effects['encounters/query'],
}))


class PatientEncounterTimeline extends PureComponent {

  static propTypes = {
    request: PropTypes.string.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    activeEncounter: {},
  }

  static defaultProps = {
    triageCategoryVisible: false,
    patient: {},
  };

  componentDidMount() {
    const { dispatch, patient } = this.props;

    if (patient) {
      dispatch({
        type: 'encounters/queryPatientEncounters',
        payload: {
          patientId: patient.id,

        }
      });
    }
  }
  handleEncounterClick = (encounter) => {
    this.setState({
      activeEncounter: encounter,
    });
    this.props.handleHistoryVisit(encounter);
  }
  renderSteps = (encounter) => {
    const { activeEncounter } = this.state;
    return (
      <Step
        key={encounter.id}
        onClick={() => this.handleEncounterClick(encounter)}
        status={encounter.id == activeEncounter.id ? "finish" : "wait"}
        title={moment(encounter.creationDate).local().format(dateTimeFormat)}
      />
    );
  }
  // customDot = (dot, { status, index }) => {
  //   return (
  //     <Popover content={<span>step {index} status: {status}</span>}>
  //       {dot}
  //     </Popover>
  //   )
  // }


  render() {
    const { encounters } = this.props;
    const { list, loading, success, pagination } = encounters;
    let sortedList = [];
    if (list && list.length > 0) {
      sortedList = orderBy(list, ['creationDate'], ['desc']);
    }


    return (

      <div>
        {!loading && success &&
          <Steps progressDot size="small" current={1}>
            {sortedList.map((encounter) => this.renderSteps(encounter))}
          </Steps>
        }
      </div>
    );
  }
}


export default PatientEncounterTimeline;
