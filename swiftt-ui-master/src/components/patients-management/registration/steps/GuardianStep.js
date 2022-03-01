import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import GuardianView from '../../patient/related/guardian';

@connect(({ patient, loading }) => ({
  patient,
  loading: loading.effects['patient/query'],
}))
class GuardianRegistrationForm extends PureComponent {

  static defaultProps = {
    loading: false,
    patient: {},
  };

  static propTypes = {
    loading: PropTypes.bool,
    patient: PropTypes.object.isRequired,
  };

  render() {
    const { patient } = this.props;
    const { success, loading, data } = patient;
    
    const userProp = {
      loadData: true,
      userProfile: data.user,
      patientProfile: data
    };

    return (
      <div style={{ padding: 20 }}>
        {success && data.id ? <GuardianView {...userProp} /> : <Card loading={loading} /> }
      </div>
    );
  }
}

export default GuardianRegistrationForm;
