import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, InputNumber, Radio, Checkbox, Modal, LocaleProvider, Select, Tooltip, Icon, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DeductionTypeSelect from '../../../../common/accounting/DeductionTypeSelect';
import WalletTypeSelect from '../../../../common/WalletTypeSelect';
import VisitTypeSelect from '../../../../common/VisitTypeSelect';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class PriceDeductionModal extends PureComponent {

  static defaultProps = {
    visible: false,
    item: {},
    onOk: () => {},
    onCancel: () => {},
  };

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = { isAllowManualEntryTrue: false };

  handleOk = () => {
    const { form, item, onOk } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };

      // DO VALIDATIONS HERE
      onOk(data);
    });
  }

  allowManualEntryChangeHandlere = (e) => {
    this.setState({
      isAllowManualEntryTrue: e.target.checked,
    });
  }

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, getFieldsError, validateFields, setFieldsValue } = form;

    const { isAllowManualEntryTrue } = this.state;

    const modalOpts = {
      title: `${type === 'create' ? 'New Deduction' : 'Edit Deduction'}`,
      visible,
      width: 600,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const deductionTypeSelectProps = {
      onDeductionTypeSelect(value) {
        setFieldsValue({ deductionType: value });
      },
    };

    const walletTypeSelectProps = {
      multiSelect: false,
      onWalletTypeSelect(value) {
        setFieldsValue({ billableWalletType: value });
      }
    };

    const visitTypeSelectProps = {
      multiSelect: true,
      onVisitTypeSelect(value) {
        setFieldsValue({ visitTypes: value });
      }
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Deduction Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('deductionType', {
                initialValue: item.deductionType,
                rules: [
                  {
                    required: true,
                    message: 'Deduction type must be Selected',
                 },
                ],
             })(<DeductionTypeSelect
                  editValue={item.deductionType ? item.deductionType.name : null}
                  {...deductionTypeSelectProps} />)}
            </FormItem>
            <Row>
              <Col span={14} offset={6}>
                <FormItem>
                  {getFieldDecorator('allowManualEntry', {
                    valuePropName: 'checked',
                    initialValue: item.allowManualEntry,
                  })(
                    <Checkbox onChange={this.allowManualEntryChangeHandlere}>
                      <span>Allow manual entry of value? &nbsp;
                        <Tooltip title="Allows definition of value and type of value during billing">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>)
                 }
                </FormItem>
              </Col>
            </Row>
            <FormItem {...formItemLayout} label="Type of Value" hasFeedback>
              {getFieldDecorator('calculationStrategy', {
                initialValue: item.calculationStrategy ? item.calculationStrategy : null,
                rules: [
                  {
                    required: true,
                    message: 'Type of value must be specified',
                 },
                ],
             })(
               <Radio.Group disabled={isAllowManualEntryTrue}>
                 <Radio value="PERCENTAGE">Percentage</Radio>
                 <Radio value="VALUE">Value</Radio>
               </Radio.Group>
              )}
            </FormItem>
            <FormItem label="Deduction Value" hasFeedback {...formItemLayout}>
              {getFieldDecorator('value', {
                initialValue: item.value ? item.value : 0.00,
                rules: [
                  {
                    required: true,
                    message: 'Deduction value must be Selected',
                 },
                ],
             })(<InputNumber disabled={isAllowManualEntryTrue} min={0} />)}
            </FormItem>
            <FormItem label="Billable Wallet Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('billableWalletType', {
                initialValue: item.billableWalletType ? item.billableWalletType : null,
                rules: [
                  {
                    required: true,
                    message: 'Billable wallet type must be Selected',
                 },
                ],
             })(<WalletTypeSelect
                  editValue={item.billableWalletType ? item.billableWalletType.name : null}
                  {...walletTypeSelectProps} />)}
            </FormItem>
            <FormItem label="Applicable to" hasFeedback {...formItemLayout}>
              {getFieldDecorator('visitTypes', {
                initialValue: item.visitTypes ? item.visitTypes : [],
                rules: [
                  {
                    required: true,
                    message: 'At least one visit type must be Selected',
                 },
                ],
             })(<VisitTypeSelect
                editValues={item.visitTypes ? item.visitTypes : null}
                {...visitTypeSelectProps} />)}
            </FormItem>
          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default PriceDeductionModal;
