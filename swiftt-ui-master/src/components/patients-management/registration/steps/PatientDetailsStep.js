import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form, Input, Select, Row, Col, Tooltip, Radio, LocaleProvider, Icon,
  message,
  InputNumber,
  Button,
  DatePicker,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import CountrySelect from '../../../common/CountrySelect';
import CustomDatePicker from '../../../common/CustomDatePicker';
import DuplicatePatientsModal from '../DuplicatePatientsModal';
import IdentificationTypeSelect from '../../../common/IdentificationTypeSelect';
import PhoneNumberInput from '../../../common/PhoneNumberInput';
import RegionSelect from '../../../common/RegionSelect';
import ReligionSelect from '../../../common/ReligionSelect';
import TitleSelect from '../../../common/TitleSelect';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
const currentLocaleData = moment.localeData();
const dateFormat = 'YYYY-MM-DD';
const allowFuture = false;
const allowPast = true;
var diffDuration;
var dateOfBirthIso = {
  year: null,
  month: null,
  day: null,
};
@Form.create()
@connect(({ patients }) => ({
  patients,
}))
class PatientDetailsStep extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func,
    patients: PropTypes.object,
  };

  state = {
    minimumRequiredAge: null,
    calculatedDateOfBirth: null,
    selectedCountry: {},
    showDuplicatePatientsModal: false,
    identificationTypeDisabled: true,
    isIdentificationFieldDisabled: true,
    isIdentificationRequired: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'patients/purge' });
  }

  componentWillReceiveProps(nextProps) {
    if ('patients' in nextProps) {
      nextProps.patients.list.length > 0 ?
        this.setState({ showDuplicatePatientsModal: true })
        :
        this.setState({ showDuplicatePatientsModal: false });
    }
  }

  ageInputChangeHandler = (dateOfBirthMomentObject) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    // const dateOfBirthMomentObject = moment().subtract(value, 'years');
    const dateOfBirth = dateOfBirthMomentObject.format(dateFormat);
    diffDuration = moment.duration(moment().diff(moment(dateOfBirth)));
    setFieldsValue({ dateOfBirth: dateOfBirthMomentObject });
    this.setState({
      calculatedDateOfBirth: dateOfBirth,
      minimumRequiredAge: moment().diff(moment(dateOfBirth), 'years'),
      identificationTypeDisabled: false,
    });
  }

  alternativePhoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ alternativePhoneNumber: value }) : this.props.form.validateFields(['alternativePhoneNumber']));

  dateOfBirthChangeHandler = (date, dateString) => {
    this.setState({
      minimumRequiredAge: moment().diff(moment(dateString), 'years'),
      identificationTypeDisabled: false,
    });
    this.duplicatePatientHandler(dateString);
  }
  handleDateOfBirth = (value, key) => {

    if (key === "YEAR") {
      if (typeof value != undefined) {
        dateOfBirthIso.year = value;
      }
    } else if (key === "MONTH") {
      if (typeof value != undefined) {
        dateOfBirthIso.month = value;
      }
    } else if (key === "DAY") {
      if (typeof value != undefined) {
        dateOfBirthIso.day = value;
      }
    }

    if (dateOfBirthIso.year !== null && dateOfBirthIso.month !== null && dateOfBirthIso.day !== null) {
      var isoDateOfBirth = moment().year(dateOfBirthIso.year).month(dateOfBirthIso.month).date(dateOfBirthIso.day);
      this.ageInputChangeHandler(isoDateOfBirth);

    }
  }

  duplicatePatientHandler = (dateString) => {
    const firstName = this.props.form.getFieldValue('firstName');
    const surname = this.props.form.getFieldValue('surname');

    if (dateString && firstName && surname) {
      const { dispatch } = this.props;
      dispatch({ type: 'patients/purge' });

      const payload = {
        firstName,
        surname,
        dateOfBirth: dateString,
      };

      this.props.dispatch({
        type: 'patients/query',
        payload,
      });
    }
  }

  handleCountryChange = (value) => {
    this.props.form.setFieldsValue({ countryOfOrigin: value });
    this.setState({ selectedCountry: value || {} });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, registrationMethod, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const data = {
          user: {
            dateOfBirth: values.dateOfBirth.format(dateFormat),
            emailAddress: values.emailAddress,
            firstName: values.firstName,
            gender: values.gender,
            maritalStatus: values.maritalStatus,
            region: values.region,
            religion: values.religion,
            otherNames: values.otherNames,
            phoneNumber: values.phoneNumber,
            alternativePhoneNumber: values.alternativePhoneNumber,
            countryOfOrigin: values.countryOfOrigin,
            physicalAddress: values.physicalAddress,
            surname: values.surname,
            title: values.title,
            userType: 'PATIENT',
          },
          registrationMethod: registrationMethod ? registrationMethod : 'HOSPITAL_REGISTERED',
        };

        if (values.identificationType && values.identification) {
          data.userIdentifications = [
            {
              identificationType: values.identificationType,
              identification: values.identification,
            },
          ];
        }
        dispatch({ type: 'patients/create', payload: data });
      }
    });
  }

  hasErrors = (fieldsError) => {
    return Object
      .keys(fieldsError)
      .some(field => fieldsError[field]);
  }

  identificationTypeSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue, validateFields } = form;

    setFieldsValue({ identificationType: value });

    if (value) {
      this.setState(
        { isIdentificationFieldDisabled: false, isIdentificationRequired: true },
        () => { validateFields(['identification'], { force: true }); }
      );
    } else {
      this.setState({
        isIdentificationFieldDisabled: true, isIdentificationRequired: false
      },
        () => { setFieldsValue({ identification: null }), validateFields(['identification'], { force: true }); }
      );
    }
  }

  phoneNumberChangeHandler = value =>
    (value ? this.props.form.setFieldsValue({ phoneNumber: value }) : this.props.form.validateFields(['phoneNumber']));

  titleSelectHandler = value => this.props.form.setFieldsValue({ title: value });

  render() {
    const { form, patients } = this.props;
    const { getFieldDecorator, getFieldsError, validateFields, setFieldsValue } = form;

    const {
      calculatedDateOfBirth,
      identificationTypeDisabled,
      isIdentificationFieldDisabled,
      isIdentificationRequired,
      minimumRequiredAge,
      selectedCountry,
      showDuplicatePatientsModal,
    } = this.state;
    const { iso2, phoneCode } = selectedCountry;

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
        span: 14,
        offset: 6,
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        span: 24,
      },
    };

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); } else if (!allowPast && allowFuture) { return current && current.valueOf() < Date.now(); }
    };

    const regionSelectProps = {
      onRegionSelect(value) {
        setFieldsValue({ region: value });
      },
    };

    const religionSelectProps = {
      onReligionSelect(value) {
        setFieldsValue({ religion: value });
      },
    };

    const duplicatePatientsModalProps = {
      patients,
      visible: showDuplicatePatientsModal,
      onCancel() {
        // showDuplicatePatientsModal
      },
    };

    const DuplicatePatientsModalGen = () => <DuplicatePatientsModal {...duplicatePatientsModalProps} />;

    return (
      <div id="advanced-form">
        <Row gutter={10}>
          <LocaleProvider locale={enUS}>
            <Form onSubmit={this.handleSubmit}>
              <fieldset>
                <legend>Basic Details</legend>
                <FormItem {...formItemLayout} label="Title" hasFeedback>
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select title!',
                      },
                    ],
                  })(
                    <TitleSelect onTitleSelect={this.titleSelectHandler} />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="First Name" hasFeedback>
                  {getFieldDecorator('firstName', {
                    rules: [
                      {
                        min: 2,
                        required: true,
                        message: 'Please input patient\'s first name!',
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Surname" hasFeedback>
                  {getFieldDecorator('surname', {
                    rules: [
                      {
                        min: 2,
                        required: true,
                        message: 'Please input patient\'s surname!',
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Other Names" hasFeedback>
                  {getFieldDecorator('otherNames', {
                    rules: [{ min: 2, required: false }],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Date of Birth" hasFeedback>
                  <Row gutter={8}>
                    {/* <Col span={8}> */}
                    {getFieldDecorator('dateOfBirth', {
                      rules: [
                        {
                          type: 'object',
                          required: true,
                          message: 'Date of Birth must be specified',
                        },
                      ],
                    })(
                      <div>
                        <InputGroup size="large" >
                          <Col span={4}>
                            <InputNumber size="large" min={1800} max={moment().format("YYYY")} placeholder="Year" type="number" onChange={(event) => this.handleDateOfBirth(event, "YEAR")} />
                            <span>Year(YYYY)</span>
                          </Col>
                          <Col span={6}>
                            <Select placeholder="Select Month" style={{ width: "100%" }} onChange={(event) => this.handleDateOfBirth(event, "MONTH")}>
                              {currentLocaleData.months().map((month) => {
                                return <Option value={month}>{month}</Option>;
                              })}
                            </Select>
                            <span>Month(MM)</span>
                          </Col>
                          <Col span={4}>
                            <InputNumber size="large" placeholder="Day" min={1} max={31} onChange={(event) => this.handleDateOfBirth(event, "DAY")} />
                            <span>Day(DD)</span>
                          </Col>
                          {/* console.log("years",diffDuration.years()); // 8 years
    console.log("months",diffDuration.months()); // 5 months
    console.log("days",diffDuration.days()); // 2 days */}

                          {diffDuration && (
                            <Col span={8}>
                              <span style={{ fontSize: 14 }}><strong>{diffDuration.years()}</strong> Years </span>
                              <span style={{ fontSize: 14 }}><strong>{diffDuration.months()}</strong> Months </span>
                              <span style={{ fontSize: 14 }}><strong>{diffDuration.days()}</strong> Days </span>
                            </Col>
                          )}


                        </InputGroup>
                      </div>
                    )}
                  </Row>

                </FormItem>

                <FormItem {...formItemLayout} label="Sex" hasFeedback>
                  {getFieldDecorator('gender', {
                    rules: [{ required: true, message: 'Gender must be specified' }],
                  })(
                    <RadioGroup style={{ float: 'left' }}>
                      <Radio value="FEMALE">Female</Radio>
                      <Radio value="MALE">Male</Radio>
                      {/* <Radio value="OTHER">Other</Radio> */}
                    </RadioGroup>
                  )}
                </FormItem>
              </fieldset>

              <fieldset>
                <legend>Other Details</legend>

                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                      Identification Type&nbsp;
                        <Tooltip title="Like national identity number">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                  hasFeedback
                >
                  {getFieldDecorator('identificationType')(
                    <IdentificationTypeSelect
                      disabled={identificationTypeDisabled}
                      minimumRequiredAge={minimumRequiredAge}
                      target="Person"
                      onIdentificationTypeSelect={this.identificationTypeSelectHandler}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label={(<span>Identification</span>)} hasFeedback>
                  {getFieldDecorator('identification', {
                    rules: [{ required: isIdentificationRequired, message: 'Identification must be specified' }],
                  })(<Input
                    disabled={isIdentificationFieldDisabled}
                  />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Marital Status" hasFeedback>
                  {getFieldDecorator('maritalStatus', {
                    rules: [
                      {
                        required: true,
                        message: 'Marital status must be specified',
                      },
                    ],
                  })(
                    <Select style={{ width: 200 }} placeholder="Select marital status">
                      <Option value="MARRIED">Married</Option>
                      <Option value="SINGLE">Single</Option>
                      <Option value="DIVORCED">Divorced</Option>
                      <Option value="WIDOWED">Widowed</Option>
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="Religion" hasFeedback>
                  {getFieldDecorator('religion', {
                    rules: [
                      {
                        required: true,
                        message: 'Religion must be specified',
                      },
                    ],
                  })(<ReligionSelect {...religionSelectProps} />
                  )}
                </FormItem>
                <FormItem label="Country:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('countryOfOrigin', {
                    // initialValue: institution.institutionName,
                    rules: [
                      {
                        required: true,
                        message: 'Country must be specified',
                      },
                    ],
                  })(<CountrySelect onCountrySelect={this.handleCountryChange} />)}
                </FormItem>
              </fieldset>
              <fieldset>
                <legend>Contact Information</legend>


                <FormItem {...formItemLayout} label={(<span>Physical Address</span>)} hasFeedback>
                  {getFieldDecorator('physicalAddress', {
                    rules: [
                      {
                        required: true,
                        message: 'Physical / Street address must be specified',
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Region" hasFeedback>
                  {getFieldDecorator('region', {})(<RegionSelect {...regionSelectProps} />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="E-mail" hasFeedback>
                  {getFieldDecorator('emailAddress', {
                    rules: [
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Phone Number" hasFeedback>
                  {getFieldDecorator('phoneNumber', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input valid phone number!',
                      },
                    ],
                  })(<PhoneNumberInput
                    countryCode={iso2}
                    phoneCode={phoneCode}
                    onPhoneNumberChange={this.phoneNumberChangeHandler}
                  />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Alternative Phone">
                  {getFieldDecorator('alternativePhoneNumber', {})(<PhoneNumberInput
                    countryCode={iso2}
                    phoneCode={phoneCode}
                    onPhoneNumberChange={this.alternativePhoneNumberChangeHandler}
                  />)}
                </FormItem>

                <FormItem {...noLabelTailFormItemLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={this.hasErrors(getFieldsError())}
                  >Save &amp; Proceed
                    </Button>
                </FormItem>
              </fieldset>
            </Form>
          </LocaleProvider>
        </Row>

        <DuplicatePatientsModalGen />
      </div>
    );
  }
}

export default PatientDetailsStep;
