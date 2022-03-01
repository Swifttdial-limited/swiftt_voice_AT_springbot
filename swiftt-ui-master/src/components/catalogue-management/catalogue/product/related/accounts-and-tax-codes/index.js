import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Button, Tooltip, Icon, Tag, Form, LocaleProvider, Row, Col, Table, Modal } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AccountSelect from '../../../../../common/AccountSelect';
import TaxCodeSelect from '../../../../../common/accounting/TaxCodeSelect';

const confirm = Modal.confirm;
const FormItem = Form.Item;

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
class ProductAccountsDetailsView extends PureComponent {

  state = {
    isEditActive: false,
  }

  static defaultProps = {
    product: {},
    onIncomeAccountRemove: () => {},
    onProductUpdate: () => {},
  };

  static propTypes = {
    product: PropTypes.object.isRequired,
    onIncomeAccountRemove: PropTypes.func,
    onProductUpdate: PropTypes.func,
  };

  onEditDetailsButtonClickHandler = () => {
    this.setState((previousState, currentProps) => {
      return {
        isEditActive: !previousState.isEditActive
      };
    });
  }

  handleFormUpdateSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onProductUpdate(values);
      }
    });
  }

  handleAccountListMenuClick = (record, e) => {
    const { onIncomeAccountRemove } = this.props;
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        onIncomeAccountRemove(record.publicId);
      },
    });
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  inventoryStockAccountSelectHandler = value => this.props.form.setFieldsValue({ stockAccount: value });

  stockCostAccountSelectHandler = value => this.props.form.setFieldsValue({ costAccount: value });

  taxCodeSelectHandler = value => this.props.form.setFieldsValue({ taxCode: value });

  render() {
    const { form, onIncomeAccountsAdd, product } = this.props;
    const { getFieldDecorator, getFieldsError, setFieldsValue } = form;

    const { isEditActive } = this.state;

    const accountColumns = [
      {
        title: 'Account Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Account Number',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            isEditActive ? <Button type="dashed" shape="circle" icon="delete" onClick={this.handleAccountListMenuClick.bind(null, record)} /> : null
          );
        },
      },
    ];

    const incomeAccountsToolbar = (
      <Row gutter={24}>
        <Col lg={12} md={12} sm={16} xs={24}>
          <p>Income Accounts</p>
        </Col>
        {isEditActive
          && (
          <Col lg={{ offset: 4, span: 8 }} md={12} sm={8} xs={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={onIncomeAccountsAdd}><Icon type="plus" />New Income Account</Button>
          </Col>
)}
      </Row>
    );

    const accountSelectProps = {
      multiSelect: false,
    };

    const formItems = (
      <div>
        <FormItem label="Cost Account:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('costAccount', {
              initialValue: product.costAccount,
              rules: [
                {
                  required: false,
                  message: 'Stock cost account must be specified',
               },
              ],
           })(<AccountSelect
             editValue={product.stockAccount ? product.stockAccount.name : null}
             {...accountSelectProps}
             onAccountSelect={this.stockCostAccountSelectHandler}
           />)}
        </FormItem>
        <FormItem label="Inventory / Stock Account:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('stockAccount', {
              initialValue: product.stockAccount,
              rules: [
                {
                  required: false,
                  message: 'Inventory stock account must be specified',
               },
              ],
           })(<AccountSelect
             editValue={product.stockAccount ? product.stockAccount.name : null}
             {...accountSelectProps}
             onAccountSelect={this.inventoryStockAccountSelectHandler}
           />)}
        </FormItem>
        <FormItem label="Tax Rate:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('taxCode', {
              initialValue: product.taxCode,
              rules: [
                {
                  required: false,
                  message: 'Tax rate must be specified',
               },
              ],
           })(<TaxCodeSelect
             editValue={product.taxCode ? product.taxCode.name : null}
             onTaxCodeSelect={this.taxCodeSelectHandler}
           />)}
        </FormItem>
      </div>
    );

    return (
      <LocaleProvider locale={enUS}>
        <Form layout="horizontal" onSubmit={this.handleFormUpdateSubmit}>
          {!isEditActive && (
          <Row>
            <Col offset={22} span={2}>
              <Tooltip title="Edit details">
                <Button type="dashed" shape="circle" icon="edit" onClick={this.onEditDetailsButtonClickHandler} />
              </Tooltip>
            </Col>
          </Row>
)}
          <Table
            title={() => incomeAccountsToolbar}
            pagination={false}
            rowKey={record => record.id}
            dataSource={product.incomeAccounts}
            columns={accountColumns}
            size="middle"
            style={{ marginBottom: '20px' }}
          />
          {!isEditActive
          ?
            (
              <div>
                <p>Cost Account: {product.costAccount ? product.costAccount.name : 'Not Specified'}</p>
                {/* <p>Liability Account: {product.liabilityAccount ? product.liabilityAccount.name : 'Not Specified'}</p> */}
                <p>Inventory / Stock Account: {product.stockAccount ? product.stockAccount.name : 'Not Specified'}</p>
                <p>Tax Rate: {product.taxCode ? product.taxCode.name : 'Not Specified'}</p>
              </div>
            )
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
                        disabled={this.hasErrors(getFieldsError())}
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

export default ProductAccountsDetailsView;
