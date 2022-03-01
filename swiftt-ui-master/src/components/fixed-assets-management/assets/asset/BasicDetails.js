import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Tooltip,
  Icon,
  Tag,
  Form,
  Input,
  LocaleProvider,
  Row,
  Checkbox,
  Col
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import DescriptionList from '../../../DescriptionList';

const { Description } = DescriptionList;

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

class AssetBasicDetailsView extends PureComponent {

  static defaultProps = {
    asset: {},
    onAssetUpdate: () => { },
  };

  static propTypes = {
    asset: PropTypes.object.isRequired,
    onAssetUpdate: PropTypes.func,
  };

  state = {
    isEditActive: false
  };

  onEditDetailsButtonClickHandler = () => {
    this.setState({ isEditActive: !this.state.isEditActive });
  }

  handleFormUpdateSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onAssetUpdate(values);
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }


  render() {
    const { form, asset } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldValue, setFieldsValue } = form;

    const {
      isEditActive
    } = this.state;

    const brandSelectProps = {
      multiSelect: false,
    };

    const noLabelTailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };

    let assetDescriptionList = <DescriptionList size="small" col="2" />;
    assetDescriptionList = (
      <DescriptionList size="small" col="2">
        <Description term="Asset Name">{asset.assetName ? asset.assetName : 'Not Specified'}</Description>
        <Description term="Category">{asset.assetCategory ? asset.assetCategory.assetCategoryName : 'Not Specified'}</Description>
        <Description term="Barcode">{asset.barcode ? asset.barcode : 'Not Specified'}</Description>
        <Description term="Alternative Barcode">{asset.alternativeBarcode ? asset.alternativeBarcode : 'Not Specified'}</Description>
        <Description term="Custom Code">{asset.customProductCode ? asset.customProductCode : 'Not Specified'}</Description>
      </DescriptionList>
    );


    const assetNameFormItem = (
      <FormItem label="Asset Name：" hasFeedback {...formItemLayout}>
        {getFieldDecorator('assetName', {
          initialValue: asset.assetName,
          rules: [
            {
              required: true,
              message: 'Asset name must be specified',
            },
          ],
        })(<Input placeholder="Asset name" />)}
      </FormItem>
    );

    const barcodeFormItem = (
      <div>
        <FormItem label="Barcode:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('barcode', {
            initialValue: asset.barcode,
          })(
            <Input placeholder="Barcode" />
          )}
        </FormItem>
        <FormItem label="Alternative Barcode:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('alternativeBarcode', {
            initialValue: asset.alternativeBarcode,
          })(<Input placeholder="Alternative Barcode" />)}
        </FormItem>
      </div>
    );

    const customProductCodeFormItem = (
      <FormItem label="Custom Code:" hasFeedback {...formItemLayout}>
        {getFieldDecorator('customAssetCode', {
          initialValue: asset.customAssetCode,
        })(
          <Input placeholder="Custom Code" />
        )}
      </FormItem>
    );


    return (
      <LocaleProvider locale={enUS}>
        <Form layout="horizontal" onSubmit={this.handleFormUpdateSubmit} style={{ marginBottom: 20 }} >
          {isEditActive
            ? (
              <div>
                {assetNameFormItem}
                {barcodeFormItem}
                {customProductCodeFormItem}
                <FormItem {...tailFormItemLayout}>
                  <Row>
                    <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={this.hasErrors(getFieldsError())}
                      >Save</Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={this.onEditDetailsButtonClickHandler}
                      >Cancel</Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>
            ) : (
              <div>
                <Row>
                  <Col style={{ textAlign: 'right' }}>
                    <Tooltip title="Edit details">
                      <Button icon="edit" onClick={this.onEditDetailsButtonClickHandler}>Edit</Button>
                    </Tooltip>
                  </Col>
                </Row>

                {assetDescriptionList}

              </div>
            )}
        </Form>
      </LocaleProvider>
    );
  }
}

export default AssetBasicDetailsView;
