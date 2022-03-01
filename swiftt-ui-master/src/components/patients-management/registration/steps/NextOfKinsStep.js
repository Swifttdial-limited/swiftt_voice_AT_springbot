import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import NextOfKinsView from '../../patient/related/next-of-kins';

@connect(({ patient, loading }) => ({
  patient,
  loading: loading.effects['patient/query'],
}))
class NextOfKinsRegistrationForm extends PureComponent {

  static defaultProps = {
    loading: false,
    patient: {},
  };

  static propTypes = {
    loading: PropTypes.bool,
    patient: PropTypes.object.isRequired,
  };

  render() {
    const { loading, patient } = this.props;
    const { data } = patient;

    const userProp = {
      loadData: true,
      userProfile: data.user,
    };

    return (
      <div style={{ padding: 20 }}>
        { data.id ? <NextOfKinsView {...userProp} /> : <Card loading={loading} /> }
      </div>
    );
  }
}

export default NextOfKinsRegistrationForm;
