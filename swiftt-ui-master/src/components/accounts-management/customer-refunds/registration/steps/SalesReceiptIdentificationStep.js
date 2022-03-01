import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

@connect(({ contact, loading }) => ({
  contact,
  loading: loading.effects['contact/query'],
}))
class SalesReceiptIdentificationStep extends PureComponent {

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

      </div>
    );
  }
}

export default SalesReceiptIdentificationStep;
