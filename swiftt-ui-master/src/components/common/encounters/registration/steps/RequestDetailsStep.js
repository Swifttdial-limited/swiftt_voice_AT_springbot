import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import RequestsView from '../../../requests/services';

function RequestDetailsStep({
  encounter: {
    data,
  },
}) {
  return (
    <Row type="flex" justify="center">
      <Col span={22}>
        <RequestsView encounter={data} />
      </Col>
    </Row>
  );
}

RequestDetailsStep.propTypes = {
  encounter: PropTypes.object.isRequired,
};

function mapStateToProps({ encounter }) {
  return { encounter };
}

export default connect(mapStateToProps)(RequestDetailsStep);
