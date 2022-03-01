import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  LocaleProvider,
  Checkbox,
  Row,
  Col,
  Tooltip,
  Icon
} from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';
//import GroupSelect from "../../../common/GroupSelect";
import AssetCategorySelect from "../../../common/AssetCategoriesSelect";
import AccountSelect from '../../../../components/common/AccountSelect';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class modal extends PureComponent {

  static propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { showAssetCategorySelect: false };
  }

  onParentGroupToggleHandler = (e) => {
    if (e.target.checked) { this.setState({ showAssetCategorySelect: true }); } else { this.setState({ showAssetCategorySelect: false }); }
  }

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
      onOk(data);
    });
  }

  bankAccountsSelectHandler = value => this.props.form.setFieldsValue({ bankAccount: value });
  assetAccountsSelectHandler = value => this.props.form.setFieldsValue({ assetAccount: value });
  depreciationExpenseAccountSelectHandler = value => this.props.form.setFieldsValue({ depreciationExpenseAccount: value });
  accumulatedDepreciationAccountSelectHandler = value => this.props.form.setFieldsValue({ accumulatedDepreciationAccount: value });
  revenueAccountSelectHandler = value => this.props.form.setFieldsValue({ revenueAccount: value });
  lossAccountSelectHandler = value => this.props.form.setFieldsValue({ lossAccount: value });
  //contactChangeHandler = value => this.props.form.setFieldsValue({ boughtFrom: value });

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const { showAssetCategorySelect } = this.state;

    const modalOpts = {
      title: `${type === 'create' ? 'New Asset Category' : 'Edit Asset Category'}`,
      visible,
      width:600,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const assetCategorySelectProps = {
      disabled: !showAssetCategorySelect,
      multiSelect: false,
      onGroupSelect(value) {
        setFieldsValue({ parentAssetCategory: value });
      },
    };

    const bankAccountsSelectProps = {
      multiSelect: false,
    };

    const assetAccountsSelectProps = {
      multiSelect: false,
    };

    const depreciationExpenseAccountSelectProps = {
      multiSelect: false,
    };

    const accumulatedDepreciationAccountSelectProps = {
      multiSelect: false,
    };

    const revenueAccountSelectProps = {
      multiSelect: false,
    };

    const lossAccountSelectProps = {
      multiSelect: false,
    };

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="Name：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('assetCategoryName', {
                initialValue: item.assetCategoryName,
                rules: [
                  {
                    required: true,
                    message: 'asset category name must be specified',
                 },
                ],
             })(<Input placeholder="asset category name" />)}
            </FormItem>

            <Row style={{ marginBottom: 10 }}>
              <Col span={14} offset={6} >
                <Checkbox onChange={this.onParentGroupToggleHandler}>
                  <span>Is sub-category of? &nbsp;
                    <Tooltip title="Is it a sub-category?">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                </Checkbox>
              </Col>
            </Row>
            {showAssetCategorySelect && (
              <FormItem label="Parent Asset category" hasFeedback {...formItemLayout}>
                {getFieldDecorator('parentAssetCategory', {
                  rules: [
                    {
                      required: showAssetCategorySelect,
                      message: 'Parent Group must be specified',
                    },
                  ],
                })(<AssetCategorySelect {...assetCategorySelectProps} />)}
              </FormItem>
            )}

            <FormItem label="Description：" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
             })(<TextArea rows={4} />)}
            </FormItem>


            <fieldset>
              <legend>Accounts</legend>

              <FormItem label="Bank Account:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('bankAccount', {
                  rules: [
                    {
                      required:  true,
                      message: 'bank account must be specified',
                    },
                  ],
                })(<AccountSelect {...bankAccountsSelectProps}
                                  onAccountSelect={this.bankAccountsSelectHandler} />)}
              </FormItem>

              <FormItem label="Asset Account:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('assetAccount', {
                  rules: [
                    {
                      required:  true,
                      message: 'asset account must be specified',
                    },
                  ],
                })(<AccountSelect {...assetAccountsSelectProps}
                                  onAccountSelect={this.assetAccountsSelectHandler} />)}
              </FormItem>

              <FormItem label="deprec. Expense Account:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('depreciationExpenseAccount', {
                  rules: [
                    {
                      required:  true,
                      message: 'depreciation Expense Account must be specified',
                    },
                  ],
                })(<AccountSelect {...depreciationExpenseAccountSelectProps}
                                  onAccountSelect={this.depreciationExpenseAccountSelectHandler} />)}
              </FormItem>

              <FormItem label="accum. Depreciation Account:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('accumulatedDepreciationAccount', {
                  rules: [
                    {
                      required:  true,
                      message: 'accumulated Depreciation Account must be specified',
                    },
                  ],
                })(<AccountSelect {...accumulatedDepreciationAccountSelectProps}
                                  onAccountSelect={this.accumulatedDepreciationAccountSelectHandler} />)}
              </FormItem>

              <FormItem label="revenue Account:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('revenueAccount', {
                  rules: [
                    {
                      required:  true,
                      message: 'revenue Account must be specified',
                    },
                  ],
                })(<AccountSelect {...revenueAccountSelectProps}
                                  onAccountSelect={this.revenueAccountSelectHandler} />)}
              </FormItem>

              <FormItem label="loss Account:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('lossAccount', {
                  rules: [
                    {
                      required:  true,
                      message: 'loss Account must be specified',
                    },
                  ],
                })(<AccountSelect {...lossAccountSelectProps}
                                  onAccountSelect={this.lossAccountSelectHandler} />)}
              </FormItem>

            </fieldset>

          </Form>
        </Modal>
      </LocaleProvider>
    );
  }
}

export default modal;
