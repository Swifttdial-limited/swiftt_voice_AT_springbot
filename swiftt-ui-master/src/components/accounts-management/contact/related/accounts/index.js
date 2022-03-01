import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Button, Tooltip, Form, LocaleProvider, Row, Col, Modal } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../../common/AccountSelect';
import DescriptionList from '../../../../DescriptionList';

const FormItem = Form.Item;
const { Description } = DescriptionList;

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

@Form.create()
class ContactAccountDetailsView extends PureComponent {

  static defaultProps = {
    contactProfile: {},
    onContactUpdate: () => {},
  };

  static propTypes = {
    contactProfile: PropTypes.object.isRequired,
    onContactUpdate: PropTypes.func,
  };

  state = {
    isEditActive: false,
  };

  onEditDetailsButtonClickHandler = () => {
    this.setState({ isEditActive: !this.state.isEditActive });
  }

  handleFormUpdateSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onContactUpdate(values);
        this.setState({ isEditActive: false });
      }
    });
  }

  creditorsAccountSelectHandler = value => this.props.form.setFieldsValue({ creditorsAccount: value });

  debtorsAccountSelectHandler = value => this.props.form.setFieldsValue({ debtorsAccount: value });

  render() {
    const { form, contactProfile } = this.props;
    const { getFieldDecorator, getFieldsError } = form;

    const { isEditActive } = this.state;

    const accountSelectProps = {
      multiSelect: false,
    };

    let creditorsDescription = <DescriptionList size="small" col="1" />;
    if (contactProfile.id) {
      creditorsDescription = (
        <DescriptionList size="small" col="1">
          <Description term="Creditor's Account">{contactProfile.creditorsAccount ? contactProfile.creditorsAccount.name : 'Not Specified'}</Description>
        </DescriptionList>
      );
    }

    let debtorsDescription = <DescriptionList size="small" col="1" />;
    if (contactProfile.id) {
      debtorsDescription = (
        <DescriptionList size="small" col="1">
          <Description term="Debtor's Account">{contactProfile.debtorsAccount ? contactProfile.debtorsAccount.name : 'Not Specified'}</Description>
        </DescriptionList>
      );
    }

    const formItems = (
      <div>
        { contactProfile.customer && (
        <FormItem label="Debtors Account:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('debtorsAccount', {
                initialValue: contactProfile.debtorsAccount,
                rules: [
                  {
                    required: false,
                    message: 'Debtors account must be specified',
                 },
                ],
             })(<AccountSelect
               editValue={contactProfile.debtorsAccount ? contactProfile.debtorsAccount.name : null}
               {...accountSelectProps}
               onAccountSelect={this.debtorsAccountSelectHandler}
             />)}
        </FormItem>
)}
        { contactProfile.vendor && (
        <FormItem label="Creditors Account:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('creditorsAccount', {
                initialValue: contactProfile.creditorsAccount,
                rules: [
                  {
                    required: false,
                    message: 'Creditors account must be specified',
                 },
                ],
             })(<AccountSelect
               editValue={contactProfile.creditorsAccount ? contactProfile.creditorsAccount.name : null}
               {...accountSelectProps}
               onAccountSelect={this.creditorsAccountSelectHandler}
             />)}
        </FormItem>
)}
      </div>
    );

    return (
      <LocaleProvider locale={enUS}>
        <Form layout="horizontal" onSubmit={this.handleFormUpdateSubmit}>
          {!isEditActive ? (
            <div>
              <Row>
                <Col offset={22} span={2}>
                  <Tooltip title="Edit details">
                    <Button type="dashed" shape="circle" icon="edit" onClick={this.onEditDetailsButtonClickHandler} />
                  </Tooltip>
                </Col>
              </Row>
              { contactProfile.customer && (<div>{ debtorsDescription }</div>) }
              { contactProfile.vendor && (<div>{ creditorsDescription }</div>) }
            </div>)
          :
            (
              <div>
                {formItems}
                <FormItem {...tailFormItemLayout}>
                  <Row>
                    <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                      >Save
                      </Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={this.onEditDetailsButtonClickHandler}
                      >Cancel
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>
            )
        }
        </Form>
      </LocaleProvider>
    );
  }
}

export default ContactAccountDetailsView;
