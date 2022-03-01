import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import {
  Icon,
  message,
  Row,
  Col,
  Alert,
  Button,
  Card,
  Dropdown,
  Menu,
  Modal,
} from 'antd';

import Authorized from '../../../../utils/Authorized';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/DescriptionList';
import ContactAccountsDetailsView from '../../../../components/accounts-management/contact/related/accounts';
import ContactDetailsView from '../../../../components/accounts-management/contact/related/ContactDetails';
import ContactIdentificationsView from '../../../../components/accounts-management/contact/related/contact-identifications';
import ContactPersonsView from '../../../../components/accounts-management/contact/related/contact-persons';
import FilesView from '../../../../components/common/files';
import ContactProfileModal from '../../../../components/accounts-management/contact/Modal';
import CustomerModal from '../../../../components/accounts-management/contact/CustomerModal';
import VendorModal from '../../../../components/accounts-management/contact/VendorModal';
import styles from './index.less';

const { Description } = DescriptionList;
const confirm = Modal.confirm;

@connect(({ contact, loading }) => ({
  contact,
  loading: loading.effects['contact/query'],
}))
class ContactProfileView extends PureComponent {

  static defaultProps = {
    contact: {},
  };

  static propTypes = {
    contact: PropTypes.object,
  };

  state = {
    operationkey: 'contactDetails',
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/accounts/contact/view/:publicId').exec(location.pathname);
    if (match) {
      dispatch({ type: 'contact/query', payload: { publicId: match[1] } });
    }
  }

  onContactProfileEditClickHandler = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'contact/showEditModal' });
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  handleMenuClick = (e) => {
    const { dispatch, contact } = this.props;
    const { data } = contact;

    if (e.key === '1') {
      dispatch({ type: 'contact/showCustomerModal' });
    } else if (e.key === '2') {
      dispatch({ type: 'contact/showVendorModal' });
    } else if (e.key === '4') {
      confirm({
        title: 'Are you sure you want to unmark this record as a Customer?',
        onOk() {
          dispatch({ type: 'contact/update', payload: Object.assign({}, data, { customer: false, debtorsAccount: null }) });
        },
      });
    } else if (e.key === '5') {
      confirm({
        title: 'Are you sure you want to unmark this record as a Vendor?',
        onOk() {
          dispatch({ type: 'contact/update', payload: Object.assign({}, data, { vendor: false, creditorsAccount: null }) });
        },
      });
    }
  }

  handleContactUpdate = (formData) => {
    const { dispatch, contact } = this.props;
    const { data } = contact;

    dispatch({ type: 'contact/update', payload: Object.assign({}, data, formData) });
  }

  render() {
    const { dispatch, contact } = this.props;
    const { loading, modalVisible, customerModalVisible, vendorModalVisible, success, data } = contact;

    const contactProfileModalProps = {
      item: data,
      visible: modalVisible,
      onOk(formData) {
        dispatch({ type: 'contact/update', payload: Object.assign({}, data, formData) });
      },
      onCancel() {
        dispatch({ type: 'contact/hideEditModal' });
      },
    };

    const customerModalProps = {
      item: data,
      visible: customerModalVisible,
      onOk(formData) {
        dispatch({ type: 'contact/update', payload: Object.assign({}, data, formData) });
      },
      onCancel() {
        dispatch({ type: 'contact/hideCustomerModal' });
      },
    };

    const vendorModalProps = {
      item: data,
      visible: vendorModalVisible,
      onOk(formData) {
        dispatch({ type: 'contact/update', payload: Object.assign({}, data, formData) });
      },
      onCancel() {
        dispatch({ type: 'contact/hideVendorModal' });
      },
    };

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {!data.customer ? (
            <Menu.Item key="1">Mark as 'Customer'</Menu.Item>
        ) : (
            <Menu.Item key="4">Unmark as 'Customer'</Menu.Item>
        )}
        {!data.vendor ? (
          <Menu.Item key="2">Mark as 'Vendor'</Menu.Item>
        ) : (
          <Menu.Item key="5">Unmark as 'Vendor'</Menu.Item>
        )}
        <Menu.Item key="3">Delete</Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        <Authorized authority="UPDATE_CONTACT">
          <Button
            icon="edit"
            onClick={this.onContactProfileEditClickHandler}
          >Edit Contact Details
          </Button>
          <Dropdown.Button type="primary" overlay={menu}>
            <Icon type="copy" />Other Actions
          </Dropdown.Button>
        </Authorized>
        <Authorized authority="ARCHIVE_CONTACT">
          <Button type="primary">Archive</Button>
        </Authorized>
      </div>
    );

    let description = <DescriptionList className={styles.headerList} size="small" col="2" />;
    if (data.id) {
      description = (
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="Name">{data.name}</Description>
          <Description term="Code">{data.code}</Description>
          <Description term="Customer Category">{data.customerCategory ? data.customerCategory.name : 'Not specified'}</Description>
          <Description term="Vendor Category">{data.vendorCategory ? data.vendorCategory.name : 'Not specified'}</Description>
        </DescriptionList>
      );
    }

    const tabList = [{
      key: 'contactDetails',
      tab: 'Contact Details',
    }, {
      key: 'contactIdentifications',
      tab: 'Identifications',
    }, {
      key: 'contactPersons',
      tab: 'Contact Persons',
    }, {
      key: 'accounts',
      tab: 'Accounts',
    }, {
      key: 'attachments',
      tab: 'Attachments',
    }, ];

    // {
    //   key: 'purchasePreferences',
    //   tab: 'Purchase Preferences',
    // }, {
    //   key: 'vendorPurchaseItems',
    //   tab: 'Vendor Purchase Items',
    // }

    let contentList = {};
    if (data.id) {
      contentList = {
        contactDetails: <ContactDetailsView contactProfile={data} onContactUpdate={this.handleContactUpdate} />,
        contactIdentifications: <ContactIdentificationsView contactProfile={data} />,
        contactPersons: <ContactPersonsView contactProfile={data} />,
        accounts: <ContactAccountsDetailsView contactProfile={data} onContactUpdate={this.handleContactUpdate} />,
        attachments: <FilesView context={data.publicId} contextType="CONTACT" readyOnly={false} />,
        purchasePreferences: <p>Empty</p>,
        vendorPurchaseItems: <p>Empty</p>,
      };
    }

    const ContactProfileModalGen = () => <ContactProfileModal {...contactProfileModalProps} />
    const CustomerModalGen = () => <CustomerModal {...customerModalProps} />
    const VendorModalGen = () => <VendorModal {...vendorModalProps} />

    return (
      <PageHeaderLayout
        className="tabs"
        title={data.name ? data.name : 'Code: Not specified'}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={data.id ? action : null}
        content={description}
        tabList={tabList}
        tabActiveKey="contactDetails"
        onTabChange={this.onOperationTabChange}
      >
        <Card>{contentList[this.state.operationkey]}</Card>
        <ContactProfileModalGen />
        <CustomerModalGen />
        <VendorModalGen />
      </PageHeaderLayout>
    );
  }
}

export default ContactProfileView;
