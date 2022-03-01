import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Checkbox,
  LocaleProvider,
  Tooltip,
  Icon,
  Select,
  Divider
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DescriptionList from '../../../DescriptionList';

const { Description } = DescriptionList;
const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const noLabelTailFormItemLayout = {
  wrapperCol: {
    span: 16,
    offset: 6,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 6 },
  },
};

@Form.create()
@connect(({ inventoryPreferences, loading }) => ({
  inventoryPreferences,
  loading: loading.effects['inventoryPreferences.query']
}))
class InventoryPreferencesView extends PureComponent {

  static propTypes = {
    inventoryPreferences: PropTypes.object,
  };

  state = {
    isEditActive: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'inventoryPreferences/query' });
  }

  onEditDetailsButtonClickHandler = () => this.setState({ isEditActive: !this.state.isEditActive });

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form, inventoryPreferences } = this.props;
    const { data } = inventoryPreferences;
    const { validateFields, getFieldsValue } = form;

    const preference = data.id ? data : null;

    validateFields((errors) => {
      if (!errors) {
        const updateData = {
          ...getFieldsValue(),
          publicId: preference.publicId,
          version: preference.version,
          id: preference.id,
        };
        dispatch({ type: 'inventoryPreferences/update', payload: updateData });
      }
    });
  }

  allowNegativeStockToggleHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ negativeStocksAllowed: e.target.value });
  }


  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  handleSeparatorSelectChange = (value) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ stockValuationMethod: value });
  }

  handleFormUpdateSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const { inventoryPreferences, form } = this.props;
    const { data, loading, success } = inventoryPreferences;
    const { getFieldDecorator, getFieldsError } = form;

    const preference = data.id ? data : null;

    const { isEditActive } = this.state;

    const renderAllowNegativeStocks = () => {
      if(preference.negativeStocksAllowed) {
        return <span>Yes</span>
      } else if(!preference.negativeStocksAllowed) {
        return <span>No</span>
      }
    }

    const renderStockValuationMethod = () => {
      if(preference.stockValuationMethod === 'FIFO') {
        return <span>First In First Out</span>
      } else if(preference.stockValuationMethod === 'LIFO') {
        return <span>Last In First Out</span>
      } else if(preference.stockValuationMethod === 'WA') {
        return <span>Weighted Average</span>
      }
    }

    const inventoryPreferencesFormItems = (
      <div>
        <FormItem
          label="Method of Inventory Valuation:"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('stockValuationMethod', {
              initialValue: preference ? preference.stockValuationMethod  : null,
              rules:
                [
                  {
                    required: true,
                    message: 'Stock valuation method must be specified',
                  },
                ],
            })(
              <Select
                allowClear
                placeholder="Select a method of inventory valuation"
                onChange={this.handleSeparatorSelectChange}
              >
                <Option value="FIFO">First In First Out (FIFO)</Option>
                <Option value="WA">Weighted Average</Option>
                {/*<Option value="LIFO">Last In First Out</Option>*/}
              </Select>
            )}
        </FormItem>
        <FormItem {...noLabelTailFormItemLayout}>
          {getFieldDecorator('negativeStocksAllowed', {
            initialValue: preference ? (preference.negativeStocksAllowed === undefined ? true : preference.negativeStocksAllowed) : null,
          })(
            <Checkbox
              defaultChecked={preference ? (preference.negativeStocksAllowed === undefined ? true : preference.negativeStocksAllowed) : null}
              onChange={this.allowNegativeStockToggleHandler}
            >
              <span>Allow negative inventoryBalances?&nbsp;
                <Tooltip title="Allow negative inventoryBalances">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            </Checkbox>)}
        </FormItem>
      </div>
    );

    return (
      <div>
        {!loading && success && (
          <div>
            {!isEditActive && (
            <Row>
              <Col offset={22} span={2}>
                <Tooltip title="Edit details">
                  <Button
                    type="dashed"
                    shape="circle"
                    icon="edit"
                    onClick={this.onEditDetailsButtonClickHandler}
                  />
                </Tooltip>
              </Col>
            </Row>
          )}
            <Form layout="horizontal" onSubmit={this.handleFormSubmit}>
              { !isEditActive ? (
                <div>
                  <DescriptionList style={{ marginBottom: 4 }} size="small" col="1">
                    <Description term="Method of Inventory Valuation">{preference ? renderStockValuationMethod() : 'Not specified'}</Description>
                    <Description term="Negative inventoryBalances allowed">{preference ? renderAllowNegativeStocks() : 'Not specified'}</Description>
                  </DescriptionList>
                </div>
              ) : (
                <div>{inventoryPreferencesFormItems}</div>
              )}
              {isEditActive && (
                <FormItem {...tailFormItemLayout}>
                  <Button
                    type="danger"
                    icon="close"
                    onClick={this.onEditDetailsButtonClickHandler}
                    style={{ marginRight: 10 }}
                  >Cancel</Button>
                  <Button
                    type="primary"
                    icon="save"
                    htmlType="submit">Save</Button>
                </FormItem>
            )}
            </Form>
          </div>
)}
      </div>
    );
  }
}

export default InventoryPreferencesView;
