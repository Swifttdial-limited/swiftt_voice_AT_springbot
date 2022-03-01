import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Checkbox,
  Tooltip,
  Icon,
  Modal,
  Radio,
  LocaleProvider,
  Button,
  Alert,
  Row,
  Col
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import ArrivalMeansSelect from '../../../ArrivalMeansSelect';
import DepartmentSelect from '../../../DepartmentSelect';
import MedicoLegalSelect from '../../../MedicoLegalSelect';
import MultiRoleUserSelect from '../../../MultiRoleUserSelect';
import PatientPaymentWalletSelect from '../../../PatientPaymentWalletSelect';
import UserSelect from '../../../UserSelect';
import VisitTypeSelect from '../../../VisitTypeSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const noLabelFormItemLayout = {
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

@Form.create()
@connect()
class EncounterDetailsStep extends PureComponent {

  static propTypes = {
    appointment: PropTypes.object,
    patient: PropTypes.object.isRequired,
  };

  state = {
    isAdmissionFieldsVisible: false,
    isEmergencyCareFieldsVisible: false,
    userSelectVisible: false,
    selectedVisitCandidateRoles: [],
  };

  handleOk = (e) => {
    const { appointment, dispatch, form, patient } = this.props;
    const { validateFields, getFieldsValue } = form;

    e.preventDefault();
    validateFields((errors) => {
      if (errors) {
        return;
      }

      const payload = { ...getFieldsValue(), patientId: patient.id };

      if(appointment) payload.appointment = appointment;

      dispatch({ type: 'encounters/create', payload });
    });
  }

  hasErrors = (fieldsError) => {
    return Object
      .keys(fieldsError)
      .some(field => fieldsError[field]);
  }

  hasRelativesNotifiedChangeHandler = (e) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ hasRelativesNotified: e.target.checked });
  }

  selectedArrivalMeansHandler = value => this.props.form.setFieldsValue({ 'visit.emergencyDetails.meansOfArrival': value });

  selectedDepartmentHandler = value => this.props.form.setFieldsValue({ 'visit.emergencyDetails.department': value });

  selectedMedicoLegalHandler = value => this.props.form.setFieldsValue({ 'visit.emergencyDetails.medicalJurisprudence': value });

  selectedPaymentWalletHandler = value => this.props.form.setFieldsValue({ 'visit.defaultPaymentWallet': value });

  visitTypeSelectHandler = (value) => {
    this.resetState();

    if (value.requiresAdmission) { this.setState({ isAdmissionFieldsVisible: true }); } else { this.setState({ isAdmissionFieldsVisible: false }); }

    /* emergency care */
    if (value.emergencyCare) { this.setState({ isEmergencyCareFieldsVisible: true }); } else { this.setState({ isEmergencyCareFieldsVisible: false }); }

    if (value.candidateAssignToRoles.length > 0) {
      this.setState({ userSelectVisible: true, selectedVisitCandidateRoles: value.candidateAssignToRoles });
    }

    this.props.form.setFieldsValue({ 'visit.visitType': value });
  }

  admittingDoctorSelectHandler = (value) => {
    this.props.form.setFieldsValue({ 'admission.admittingDoctor': value });
  }

  attendingDoctorSelectHandler = (value) => {
    this.props.form.setFieldsValue({ 'visit.emergencyDetails.attendingDoctor': value });
  }

  receivedBySelectHandler = (value) => {
    this.props.form.setFieldsValue({ 'visit.emergencyDetails.receivedBy': value });
  }

  resetState = () => {
    this.setState({
      isAdmissionFieldsVisible: false,
      isEmergencyCareFieldsVisible: false,
      userSelectVisible: false,
    });
  }

    render() {
      const { form, patient, appointment } = this.props;
      const { getFieldDecorator, getFieldsError, validateFields, getFieldsValue, getFieldValue, setFieldsValue } = form;
      const { preferences } = patient;

      const { isAdmissionFieldsVisible, isEmergencyCareFieldsVisible, userSelectVisible, selectedVisitCandidateRoles } = this.state;

      const patientPaymentWalletSelectProps = { patient: patient, status: 'ACTIVE' };
      const emergencyArrivalMeansSelectProps = { patient: patient };
      const emergencyMedicoLegalSelectProps = { patient: patient };
      const departmentSelectProps = { patient: patient };
      const visitTypeSelectProps = { multiSelect: false };

      const multiRoleUserSelectProps = {
        roles: getFieldValue('visit.visitType') ? getFieldValue('visit.visitType').candidateAssignToRoles : [],
        onUserSelect(value) {
          setFieldsValue({ 'handlers': value });
        },
      };

      return (
        <LocaleProvider locale={enUS}>
          <div>
            <Row type="flex" justify="center">
              <Col span={22}>
                { appointment && (
                  <Alert message="Informational Notes" type="info" showIcon />
                )}

                { patient.medicalRecordNumber ? null : (
                  <Alert
                    message="Information"
                    description="Patient OTC Number will be converted to MRN Number on creation of a visit."
                    type="info"
                    showIcon
                  />
                )}
              </Col>
            </Row>
            <br />

            <Form layout="horizontal" onSubmit={this.handleOk}>
              <FormItem label="Visit Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('visit.visitType', {
                  rules: [
                    {
                      required: true,
                      message: 'Visit type must be specified',
                    },
                  ],
                })(<VisitTypeSelect {...visitTypeSelectProps} onVisitTypeSelect={this.visitTypeSelectHandler} />)}
              </FormItem>

              { appointment === undefined && (
                <FormItem label="Payment Wallet" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('visit.defaultPaymentWallet', {
                    rules: [
                      {
                        required: true,
                        message: 'Payment wallet must be specified',
                      },
                    ],
                  })(<PatientPaymentWalletSelect {...patientPaymentWalletSelectProps} onPatientPaymentWalletSelect={this.selectedPaymentWalletHandler} />)}
                </FormItem>
              )}

              {/* {preferences ?
                <p>show preferred doctor</p>
                :
                <FormItem {...formItemLayout} label="Doctor" hasFeedback>
                  {getFieldDecorator('visit.doctor', {})(<Input />)}
                </FormItem>
              } */}

              {isAdmissionFieldsVisible && (
              <div>
                { getFieldValue('visit.visitType').candidateAdmittingRole ? (
                  <FormItem {...formItemLayout} label="Admitting Doctor:" hasFeedback>
                    {getFieldDecorator('admission.admittingDoctor', {
                      rules: [{
                        required: true,
                        message: 'Admitting doctor must be specified',
                      }],
                    })(<UserSelect
                        role={getFieldValue('visit.visitType').candidateAdmittingRole}
                        searchByEnabled={true}
                        onUserSelect={this.admittingDoctorSelectHandler} />)}
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label="Admitting Doctor:"
                    hasFeedback
                    help={<Alert message="Admitting role not specified for this type of visit. Please specify." type="warning" showIcon />}
                    style={{ marginBottom: 10 }}>
                    {getFieldDecorator('admission.admittingDoctor', {
                      rules: [{
                        required: true,
                        message: 'Admitting doctor must be specified',
                      }],
                    })(<Input disabled />)}
                  </FormItem>
                )}

                <FormItem {...formItemLayout} label="Admission Reason:" hasFeedback>
                  {getFieldDecorator('admission.admissionReason', {
                    rules: [{
                      required: true,
                      message: 'Admission reason must be specified',
                    }],
                  })(<TextArea rows={3} />)}
                </FormItem>
              </div>
)}
              {isEmergencyCareFieldsVisible && (
              <div>
                <FormItem label="Means of Arrival" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('visit.emergencyDetails.meansOfArrival', {
                        rules: [
                            {
                                required: true,
                                message: 'Means of arrival must be specified',
                            },
                        ],
                    })(<ArrivalMeansSelect {...emergencyArrivalMeansSelectProps} onArrivalMeansSelect={this.selectedArrivalMeansHandler} />)}
                </FormItem>
                <FormItem label="Medico Legal Jurisprudence" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('visit.emergencyDetails.medicalJurisprudence', {

                    })(<MedicoLegalSelect {...emergencyMedicoLegalSelectProps} onMedicoLegalSelect={this.selectedMedicoLegalHandler} />)}
                </FormItem>
                <FormItem label="Department" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('visit.emergencyDetails.department', {

                    })(<DepartmentSelect {...departmentSelectProps} onDepartmentSelect={this.selectedDepartmentHandler} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Attending Doctor:" hasFeedback>
                  {getFieldDecorator('visit.emergencyDetails.attendingDoctor', {
                        rules: [{
                            required: true,
                            message: 'Attending doctor must be specified',
                        }],
                    })(<UserSelect searchByEnabled={true} onUserSelect={this.attendingDoctorSelectHandler} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Referral Doctor:" hasFeedback>
                  {getFieldDecorator('visit.emergencyDetails.referralDoctor', {
                  })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Received By:" hasFeedback>
                  {getFieldDecorator('visit.emergencyDetails.receivedBy', {
                        rules: [{
                            required: true,
                            message: 'Received By must be specified',
                        }],
                    })(<UserSelect searchByEnabled={true} onUserSelect={this.receivedBySelectHandler} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Accompanied By:" hasFeedback>
                  {getFieldDecorator('visit.emergencyDetails.accompaniedBy', {
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Major Complaints:" hasFeedback>
                  {getFieldDecorator('visit.emergencyDetails.chiefComplaints', {
                        rules: [{
                            required: true,
                            message: 'Chief Complaints  must be specified',
                        }],
                    })(<TextArea rows={2} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Description of emergency:" hasFeedback>
                  {getFieldDecorator('visit.emergencyDetails.description', {

                    })(<TextArea rows={2} />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Have the relatives been notified?" hasFeedback>
                  {getFieldDecorator('visit.emergencyDetails.hasRelativesNotified', {
                    })(
                      <RadioGroup style={{ float: 'left' }}>
                        <Radio value="true">Yes</Radio>
                        <Radio value="false">No</Radio>
                        {/* <Radio value="OTHER">Other</Radio> */}
                      </RadioGroup>
                    )}
                </FormItem>
              </div>
)}

              { userSelectVisible && (
              <FormItem
                label={(
                  <span>
                    Assign To&nbsp;
                    <Tooltip title="Assign visit to a user">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                  )}
                {...formItemLayout}
                hasFeedback
              >
                {getFieldDecorator('handlers', {
                    rules: [
                      {
                        required: true,
                        message: 'Assigned user must be specified',
                      },
                    ],
                  })(<MultiRoleUserSelect {...multiRoleUserSelectProps} />)}
              </FormItem>
)}
              <FormItem
                label="Comment"
                {...formItemLayout}
                hasFeedback
              >
                {getFieldDecorator('visit.description', {})(<TextArea rows={3} />)}
              </FormItem>

              { appointment === undefined ? (
                <FormItem {...noLabelFormItemLayout}>
                  <Button
                    icon="form"
                    type="primary"
                    htmlType="submit">{isAdmissionFieldsVisible ? 'Book and Request Admission' : 'Book'}</Button>
                </FormItem>
              ) : (
                <FormItem {...noLabelFormItemLayout}>
                  <Button
                    icon="form"
                    type="primary"
                    htmlType="submit">{isAdmissionFieldsVisible ? 'Book, Request Admission and Start Appointment' : 'Book and Start Appointment'}</Button>
                </FormItem>
              )}

            </Form>
          </div>
        </LocaleProvider>
      );
    }
}

export default EncounterDetailsStep;
