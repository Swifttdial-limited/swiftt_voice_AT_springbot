import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  LocaleProvider,
  Button,
  Tooltip,
  Icon,
  Table,
  Dropdown,
  Menu,
  Tag,
  Modal,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import PreferredPractitionerModal from './Modal';

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
@connect(({ patientPreferences, loading }) => ({
  patientPreferences,
  loading: loading.effects['patientPreferences/query']
}))
class PatientPreferencesView extends PureComponent {

  static propTypes = {
    patientProfile: PropTypes.object.isRequired,
    patientPreferences: PropTypes.object.isRequired,
  };

  state = {
    isPreferencesInformationEditActive: false,
    preferredPractitioners: [],
    preferredPractitioner: {},
    modalVisible: false,
    modalType: 'create',
  };

  componentDidMount() {
    const { dispatch, patientProfile } = this.props;
    dispatch({ type: 'patientPreferences/query', payload: { patientId: patientProfile.id } });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.patientPreferences.data.preferredPractitioners != undefined
      && nextProps.patientPreferences.data.preferredPractitioners.length > 0) {
      let modifiedPreferredPractitioners = [];

      nextProps.patientPreferences.data.preferredPractitioners.forEach((preferredPractitioner) => {
        preferredPractitioner.id = Math.floor(Math.random() * 101);
        modifiedPreferredPractitioners.push(preferredPractitioner);
      });

      this.setState({ preferredPractitioners: modifiedPreferredPractitioners});
    }
  }

  onEditDetailsButtonClickHandler = () => {
    this.setState({ isPreferencesInformationEditActive: !this.state.isPreferencesInformationEditActive });
  }

  handleModalOk = (values) => {
    const { dispatch, patientPreferences, patientProfile } = this.props;
    const { data } = patientPreferences;

    data.patientId = patientProfile.id;

    if(values.id !== undefined) {
      let modifiedPreferredPractioners = data.preferredPractitioners.filter((preferredPractitioner) => {
        if(preferredPractitioner.id !== values.id) {
          return preferredPractitioner;
        }
      });

      data.preferredPractitioners = modifiedPreferredPractioners;
    }

    data.preferredPractitioners.push(values);

    dispatch({ type: 'patientPreferences/update', payload: data });
    this.hideModal();
  }

  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.onEditItem(record);
    } else if (e.key === '2') {
      this.onDeleteItem(record.id);
    }
  }

  onEditItem = (item) => {
    this.setState({ modalType: 'update', preferredPractitioner: item }, () => {
      this.showModal();
    });
  }

  onDeleteItem = (itemId) => {
    const { dispatch, patientPreferences, patientProfile } = this.props;
    const { data } = patientPreferences;

    const { preferredPractitioners } = this.state;

    data.patientId = patientProfile.id;

    let modifiedPreferredPractioners = data.preferredPractitioners.filter((preferredPractitioner) => {
      if(preferredPractitioner.id !== itemId) {
        return preferredPractitioner;
      }
    });

    data.preferredPractitioners = modifiedPreferredPractioners;

    dispatch({ type: 'patientPreferences/update', payload: data });
  }

  hideModal = () => {
    this.setState({ modalVisible: false });
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  }

  render() {
    const { dispatch, form, patientPreferences, patientProfile } = this.props;
    const { getFieldDecorator } = form;
    const { loading, data, success } = patientPreferences;

    const {
      isPreferencesInformationEditActive,
      modalVisible,
      modalType,
      preferredPractitioners,
      preferredPractitioner
    } = this.state;

    const preference = data.id ? data : null;
    const preferredPractitionerModalProps = {
      item: preferredPractitioner,
      type: modalType,
      visible: modalVisible,
      onOk: (values) => this.handleModalOk(values),
      onCancel: () => this.hideModal(),
    };

    const columns = [
      {
        title: 'Practitioner',
        dataIndex: 'practitionerName',
        key: 'practitionerName',
      }, {
        title: 'Is External?',
        dataIndex: 'externalPractitioner',
        key: 'externalPractitioner',
        render: (text) => <span>{text ? 'Yes' : 'No'}</span>,
      }, {
        title: 'Speciality',
        dataIndex: 'speciality',
        key: 'speciality',
        render: text => <span>{text ? text : 'Not Specified'}</span>,
      }, {
        title: '',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <Dropdown overlay={<Menu onClick={this.handleMenuClick.bind(null, record)}>
              <Menu.Item key="1">Edit</Menu.Item>
              <Menu.Item key="2">Delete</Menu.Item>
            </Menu>}
            >
              <Button style={{ border: 'none' }}>
                <Icon style={{ marginRight: 2 }} type="bars" />
                <Icon type="down" />
              </Button>
            </Dropdown>
          );
        },
      },
    ];

    const PreferredPractitionerModalGen = () => <PreferredPractitionerModal {...preferredPractitionerModalProps} />

    return (
      <LocaleProvider locale={enUS}>
        <div className="content-inner">
          { preference && (
            <div>
              {/*
                <Row>
                  <Col span={2} offset={22}>
                    <Tooltip title="Edit details">
                      <Button type="dashed" shape="circle" icon="edit" onClick={e => this.onEditDetailsButtonClickHandler} />
                    </Tooltip>
                  </Col>
                </Row>
                // preferences in form format here
              */}

              <Row>
                <Col span={24} style={{ textAlign: 'right', marginBottom: 10 }}>
                  <Button type="primary" icon="plus" onClick={this.showModal}>New Preferred Practitioner</Button>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col>
                  <Table
                    size="middle"
                    columns={columns}
                    dataSource={preferredPractitioners}
                    loading={loading}
                    rowKey={record => record.id}
                  />
                </Col>
              </Row>
              <PreferredPractitionerModalGen />
            </div>
          )}
        </div>
      </LocaleProvider>
    );
  }
}

export default PatientPreferencesView;
