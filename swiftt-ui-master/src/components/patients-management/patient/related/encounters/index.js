import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Timeline } from 'antd';

class EncountersView extends PureComponent {

  componentDidMount() {
    const { dispatch, patientProfile } = this.props;
    dispatch({ type: 'encounters/queryPatientEncounters', payload: { patientId: patientProfile.id } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'encounters/purge' });
  }

  render() {
    const { dispatch, encounters, patientProfile } = this.props;
    const { loading, list } = encounters;

    const dateFormat = 'YYYY-MM-DD HH:mm';

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          { list.length > 0 ?
            <Timeline>
              {list.map(visit => (
                <Timeline.Item
                  key={visit.id}
                ><b>Visit No: {visit.visitNumber ? visit.visitNumber : 'Not specified'}: Type: <span>{visit.visitType.name ? visit.visitType.name : 'Not specified' }</span></b>
                  <p>Visit Time : {moment(visit.creationDate).format(dateFormat)} : Description : {visit.description ? visit.description : 'No description'}</p>

                </Timeline.Item>
  ))}
            </Timeline>
          : <h3 style={{textAlign: 'center'}}>Patient has no visits currently</h3>}

        </Col>
      </Row>
    );
  }
}

EncountersView.propTypes = {
  patientProfile: PropTypes.object.isRequired,
  encounters: PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ encounters }) {
  return { encounters };
}

export default connect(mapStateToProps)(EncountersView);
