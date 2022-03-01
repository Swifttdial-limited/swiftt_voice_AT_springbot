import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Form,
  Input,
  Modal,
  LocaleProvider,
  Tooltip,
  Icon,
  Select,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Table,
  Tag,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import AppointmentTypeSelect from './AppointmentTypeSelect';
import DepartmentSelect from '../DepartmentSelect';
import LocationSelect from '../LocationSelect';
import CustomTimeRangeInput from '../CustomTimeRangeInput';

import { query } from '../../../services/appointments';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const dateFormat = 'YYYY-MM-DD';
const allowFuture = true;
const allowPast = false;

@Form.create()
class AppointmentModal extends PureComponent {

  static defaultProps = {
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

  state = {
    appointments: [],
    loading: false,
    showClinicSelect: false,
    showDepartmentSelect: false,
    showDoctorSelect: false,
    showTimeRangeSelect: false,
  };

  appointmentDateSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ appointmentDate: value.format(dateFormat) });

    this.fetchAppointments();
  }

  assignedDepartmentSelectHandler = (value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    setFieldsValue({ assignedDepartment: value });

    this.fetchAppointments();
  }

  fetchAppointments = () => {
    const { form } = this.props;
    const { getFieldValue, getFieldsValue } = form;

    if(getFieldValue('appointmentDate') !== null) {
      if(getFieldValue('assignedDepartment') !== null) {

        const filtersPayload = {
          date: getFieldValue('appointmentDate') instanceof Object ? getFieldValue('appointmentDate').format(dateFormat) : getFieldValue('appointmentDate'),
          department: getFieldValue('assignedDepartment').publicId,
        };

        this.setState({ loading: true });

        query({
          ...filtersPayload
        }).then((response) => {
          this.setState({ appointments: response.content, loading: false });
        }).catch((e) => {
          this.setState({ appointments: [], loading: false });
        });
      }
    } else {
      this.setState({ appointments: [], loading: false });
    }
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

  requiresConfirmationToggleHandler = e => {
    const { form } = this.props;
    const { setFieldsValue } = form;

    if(e.target.checked) {
      setFieldsValue({ status: 'SCHEDULED_AND_NEEDS_CONFIRMATION' });
    } else {
      setFieldsValue({ status: 'SCHEDULED' });
    }
  }

  resetState = () => {
    this.setState({
      showDepartmentSelect: false,
      showDoctorSelect: false,
      showClinicSelect: false,
    });
  }

  validateOperatingTime = (rule, value, callback) => {
    if ('startTime' in value && 'endTime' in value) {
      callback();
      return;
    }
    callback('Start Time and End Time must be specified');
  }
//  showTimeRangeSelectChangeHandler = (e) => e.target.checked ? this.setState({showTimeRangeSelect: false}) : this.setState({showTimeRangeSelect: true});

  render() {
    const { form, visible, type, item, onOk, onCancel } = this.props;
    const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = form;

    const {
      appointments,
      loading,
      showDoctorSelect,
      showTimeRangeSelect
    } = this.state;

    const disabledDate = (current) => {
      if (allowPast) { return current && current.valueOf() > Date.now(); } else if (!allowPast && allowFuture) { return current && current.valueOf() < Date.now(); }
    };

    const modalOpts = {
      title: `${type === 'create' ? 'New Appointment' : 'Edit Appointment'}`,
      visible,
      width: 960,
      onOk: this.handleOk,
      onCancel,
      wrapClassName: 'vertical-center-modal',
    };

    const appointmentDateSelectProps = {
      allowFuture: true,
      allowPast: false,
      showTime: false,
    };

    const appointmentTypeSelectProps = {
      multiSelect: false,
      onAppointmentTypeSelect(value) {
        setFieldsValue({ appointmentType: value });
      },
    };

    const locationSelectProps = {
      onLocationSelect(value) {
        setFieldsValue({ location: value });
      },
    };

    const departmentSelectProps = {
      multiSelect: false,
    };

    getFieldDecorator('status', { initialValue: null });

    const renderAppointmentStatusTag = (status) => {
      switch (status) {
        case 'WAITING':
          return <Tag color="orange">WAITING</Tag>;
        case 'ON_GOING':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CANCELLED':
          return <Tag color="red">CANCELLED</Tag>;
        case 'COMPLETED':
          return <Tag color="magenta">COMPLETED</Tag>;
        case 'SCHEDULED_AND_NEEDS_CONFIRMATION':
          return <Tag color="blue">NEEDS CONFIRMATION</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [{
      title: 'Name',
      dataIndex: 'patient.user.fullName',
    }, {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => renderAppointmentStatusTag(record.status)
    }, {
      title: 'Time',
      dataIndex: 'proposedStartTime',
      render: (text, record) => {
        if(record.proposedStartTime !== undefined && record.proposedEndTime !== undefined) {
          return <span>{record.proposedStartTime} - {record.proposedEndTime}</span>
        } else {
          return <span>Not Specified</span>
        }
      }
    }];

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalOpts}>
          <Row gutter={24}>
            <Col span={14}>
              <Form layout="horizontal">
                <FormItem label="Appointment Type" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('appointmentType', {
                      initialValue: item.appointmentType ? item.appointmentType : null,
                      rules: [
                          {
                              required: true,
                              message: 'Appointment type must be specified',
                          },
                      ],
                  })(<AppointmentTypeSelect
                      editValue={item.appointmentType ? item.appointmentType : null}
                      {...appointmentTypeSelectProps} />)}
                </FormItem>

                { <FormItem label="Appointment Date" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('appointmentDate', {
                      initialValue: item.appointmentDate !== undefined ? moment(item.appointmentDate) : moment(),
                      rules: [
                          {
                              required: true,
                              message: 'Appointment date must be specified',
                          },
                      ],
                    })(
                      <DatePicker
                        format={dateFormat}
                        disabledDate={disabledDate}
                        onChange={this.appointmentDateSelectHandler}
                        style={{ float: 'left' }}
                      />
                    )}
                </FormItem>}
                <FormItem label="Proposed Time：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('operatingTime', {
                        initialValue: { startTime: '00:00', endTime: '00:00' },
                        rules: [{
                            type: 'object',
                            required: showTimeRangeSelect,
                            message: 'Operating time must be specified',
                            validators: this.validateOperatingTime }],
                    })(<CustomTimeRangeInput />)}
                </FormItem>

                <Row style={{ marginBottom: 10 }}>
                  <Col span={14} offset={6}>
                    <Checkbox
                      defaultChecked={(item.id !== undefined && item.status === 'SCHEDULED_AND_NEEDS_CONFIRMATION') ? true : false}
                      onChange={this.requiresConfirmationToggleHandler}>
                      <span>Confirmation required? &nbsp;
                        <Tooltip title="The appointment requires confirmation for scheduling">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>
                  </Col>
                </Row>

                {/*
                  <FormItem label='Provider' hasFeedback {...formItemLayout}>
                    {getFieldDecorator('providerName', {
                        initialValue: item.providerName
                    })(<Input />)}
                </FormItem>
                */}

                <FormItem label="Visiting Department：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('assignedDepartment', {
                    initialValue: item.assignedDepartment ? item.assignedDepartment : null,
                    rules: [
                        {
                            required: true,
                            message: 'Visiting department must be specified',
                        },
                    ],
                  })(<DepartmentSelect
                      onDepartmentSelect={this.assignedDepartmentSelectHandler}
                      editValue={item.assignedDepartment ? item.assignedDepartment : null}
                      {...departmentSelectProps} />)}
                </FormItem>

                <FormItem label="Location：" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('location', {
                    initialValue: item.location ? item.location : null,
                    rules: [
                        {
                            required: false,
                            message: ' Location must be specified',
                        },
                    ],
                  })(<LocationSelect
                      editValue={item.location ? item.location : null}
                      {...locationSelectProps} />)}
                </FormItem>

                <FormItem label="Activity Description" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('description', {
                      initialValue: item.description,
                      rules: [],
                  })(<TextArea rows={3} />)}
                </FormItem>

                <Row style={{ marginBottom: 10 }}>
                  <Col span={14} offset={6}>
                    <Checkbox>
                      <span>Send reminder to patient? &nbsp;
                        <Tooltip title="Send reminder to patient a day before scheduled appointment">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    </Checkbox>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={10}>
              <Table
                loading={loading}
                title={() => 'Appointments'}
                columns={columns}
                dataSource={appointments}
                rowKey={record => record.id}
                size="middle"
                 />
            </Col>
          </Row>

        </Modal>
      </LocaleProvider>
    );
  }
}

export default AppointmentModal;
