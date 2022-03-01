import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import ContactPersonsView from '../../../contact/related/contact-persons';

@connect(({ contact, loading }) => ({
  contact,
  loading: loading.effects['contact/query'],
}))
class ContactPersonsRegistrationForm extends PureComponent {
  static defaultProps = {
    loading: false,
  };

  static propTypes = {
    loading: PropTypes.bool,
    contact: PropTypes.object.isRequired,
  };

  render() {
    const { loading, contact } = this.props;
    const { data } = contact;

    const contactProp = {
      contactProfile: contact.data,
    };

    return (
      <div style={{ padding: 20 }}>
        { data.id ? <ContactPersonsView {...contactProp} /> : <Card loading={loading} /> }
      </div>
    );
  }
}

export default ContactPersonsRegistrationForm;
