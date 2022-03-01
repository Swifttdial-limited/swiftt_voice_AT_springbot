import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Row, Col, Form, LocaleProvider } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';

class BillingDefinitionView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isEditActive: false };
  }

  onEditDetailsButtonClickHandler = () => this.setState({ isEditActive: !this.state.isEditActive });

  handleFormSubmit = (e) => {
    e.preventDefault();
  }

  handleFormUpdateSubmit = (e) => {
    e.preventDefault();
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { isEditActive } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 },
      },
    };

    const formItems =
      <div />;

    return (
      <LocaleProvider locale={enUS}>
        <div className="content-inner">
          <p>Coming Soon</p>
        </div>
      </LocaleProvider>
    );
  }
}

BillingDefinitionView.propTypes = {
  dispatch: PropTypes.func,
};

function mapStateToProps({}) {
  return {};
}

export default connect(mapStateToProps)(Form.create()(BillingDefinitionView));
