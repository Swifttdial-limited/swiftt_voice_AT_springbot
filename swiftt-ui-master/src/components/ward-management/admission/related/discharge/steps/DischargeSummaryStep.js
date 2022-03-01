import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Tooltip, Icon, LocaleProvider, Row, Col, Card } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import CustomEditor from '../../../../../common/CustomEditor';
import DischargeDispositionSelect from '../../../../../common/DischargeDispositionSelect';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

@Form.create()
@connect()
class DischargeSummaryStep extends PureComponent {

  static propTypes = {
    encounter: PropTypes.object.isRequired,
    form: PropTypes.object,
  };

  dischargeDispositionSelectHandler = value => {
    this.props.form.setFieldsValue({ 'dischargeSummary.dischargeDisposition': value });
  }

  editorChangeHandler = value => {
    this.props.form.setFieldsValue({ 'dischargeSummary.narrative': value });
  }

  handleSubmit = () => {
    const { dispatch, encounter, form } = this.props;
    const { getFieldsValue, validateFields } = form;

    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
      };
      dispatch({ type: 'encounter/submitDischargeSummary', payload: Object.assign({}, { encounterId: encounter.id }, data ) })
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    getFieldDecorator('dischargeSummary.narrative', {
      rules: [{ required: true, message: 'Description must be specified' }],
    });

    return (
      <div style={{ padding: 20 }}>
        <LocaleProvider locale={enUS}>
          <Form layout="horizontal">
            <FormItem
              label={(
                <span>
                    Discharge Disposition&nbsp;
                  <Tooltip title="Discharge disposition (sometimes called Discharge Status) is the final place or setting to which the patient was discharged on the day of discharge">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              hasFeedback {...formItemLayout}>
              {getFieldDecorator('dischargeSummary.dischargeDisposition', {
                  rules: [
                    {
                      required: true,
                      message: 'Discharge disposition must be specified',
                   },
                  ],
               })(<DischargeDispositionSelect
                  onDischargeDispositionSelect={this.dischargeDispositionSelectHandler} />)}
            </FormItem>

            <Row gutter={20}>
              <Col span={24}>
                <CustomEditor
                  onContentChange={this.editorChangeHandler} />
              </Col>
            </Row>

            <div style={{ marginTop: 10 }}>
              <FormItem>
                <Button
                      type="primary"
                      icon="save"
                      onClick={this.handleSubmit}
                      style={{ marginRight: 10 }}
                    >Submit
                    </Button>
              </FormItem>
            </div>
          </Form>
        </LocaleProvider>
      </div>
    );
  }

}

export default DischargeSummaryStep;
