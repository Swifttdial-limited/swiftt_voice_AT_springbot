import enUS from 'antd/lib/locale-provider/en_US';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Tabs,
  Form,
  Input,
  LocaleProvider,
  Button,
  Icon,
  Row,
  Col,
  Tooltip,
  Card,
} from 'antd';

import DescriptionList from '../../components/DescriptionList';
import TitleSelect from '../../components/common/TitleSelect';

const { Description } = DescriptionList;
const FormItem = Form.Item;

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 6 },
  },
};

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/query']
}))
class GeneralUserDetailsView extends PureComponent {

  state = {
    isEditActive: false,
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentDidMount() {
    this.props.dispatch({ type: 'profile/query' });
  }

  onEditDetailsButtonClickHandler = () => {
    this.setState({ isEditActive: !this.state.isEditActive });
  }

  render() {

    const { form, profile } = this.props;
    const { getFieldDecorator, getFieldsError, setFieldsValue } = form;
    const { loading, data: item } = profile;

    const { isEditActive } = this.state;

    const profileGeneralDetailsFormItems = (
      <div>
        <FormItem {...formItemLayout} label="Title" hasFeedback>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: 'Please select title!',
             },
            ],
         })(
           <TitleSelect onTitleSelect={this.onTitleSelectHandler} />
          )}
        </FormItem>
        <FormItem label="First Name：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('firstName', {
            initialValue: item.firstName,
            rules: [
              {
                required: true,
                message: 'First name must be specified',
             },
            ],
         })(<Input />)}
        </FormItem>
        <FormItem label="Surname:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('surname', {
            initialValue: item.surname,
            rules: [
              {
                required: true,
                message: 'Surname must be specified',
             },
            ],
         })(<Input />)}
        </FormItem>
        <FormItem label="Other Name：" hasFeedback {...formItemLayout}>
          {getFieldDecorator('otherNames', {
            initialValue: item.otherNames,
         })(<Input />)}
        </FormItem>
      </div>
    );

    return(
      <LocaleProvider locale={enUS}>
        <Card title="General">
          {!isEditActive && (
            <Row>
              <Col offset={22} span={2}>
                <Tooltip title="Edit details">
                  <Button type="dashed" shape="circle" icon="edit" onClick={this.onEditDetailsButtonClickHandler} />
                </Tooltip>
              </Col>
            </Row>
          )}

          <Form layout="horizontal">
            {!isEditActive && (
              <div>
                <DescriptionList style={{ marginBottom: 4 }} size="small" col="1">
                  <Description term="Title">{item.title ? item.title.name : 'Not specified'}</Description>
                  <Description term="First Name">{item.firstName ? item.firstName : 'Not specified'}</Description>
                  <Description term="Surname">{item.surname ? item.surname : 'Not specified'}</Description>
                  <Description term="Other Name">{item.otherNames ? item.otherNames : 'Not specified'}</Description>
                </DescriptionList>
              </div>
            )}
            {isEditActive &&
              <div>
                {profileGeneralDetailsFormItems}
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
            }
          </Form>
        </Card>
      </LocaleProvider>
    );
  }

}

export default GeneralUserDetailsView;
