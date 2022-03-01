import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Icon, Button, message, Steps } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EncounterRegistrationView from '../../../components/common/encounters/registration';

const Step = Steps.Step;

@connect(({ patient }) => ({
  patient,
}))
class EncounterRegistrationWrapperView extends PureComponent {

  static propTypes = {
    patient: PropTypes.object.isRequired,
  };

  render() {
    const { patient } = this.props;
    const { data } = patient;

    return (
      <PageHeaderLayout
        title="New Patient Visit"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <EncounterRegistrationView
          allowRequestCreation={true}
          patient={data} />
      </PageHeaderLayout>
    );
  }
}

export default EncounterRegistrationWrapperView;
