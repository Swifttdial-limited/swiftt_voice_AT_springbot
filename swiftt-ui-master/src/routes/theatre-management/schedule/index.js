
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, message, Layout, Row, Col } from 'antd';

const { Content } = Layout;

import AppointmentsCalender from '../../../components/common/appointments/AppointmentsCalendar';

function OperationTheatreScheduleView(operationTheatre) {
  const operationTheatreProps = {
    isTheatre: true,
  };


  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px', backgroundColor: '#ffffff' }}>
        <div className="content-inner">
          <Row>
            <Col>
              <AppointmentsCalender location={operationTheatreProps} />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

OperationTheatreScheduleView.propTypes = {
  location: PropTypes.object,
};


export default OperationTheatreScheduleView;
