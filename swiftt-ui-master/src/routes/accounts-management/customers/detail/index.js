import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import { Icon, message, Row, Col, Alert, Button, Card } from 'antd';

import Authorized from '../../../../utils/Authorized';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/DescriptionList';
import ContactDetailsView from '../../../../components/accounts-management/contact/related/ContactDetails';
import ContactPersonsView from '../../../../components/accounts-management/contact/related/contact-persons';
import FilesView from '../../../../components/common/files';
import styles from './index.less';

const { Description } = DescriptionList;

@connect(({ contact, loading }) => ({
  contact,
  loading: loading.effects['contact/query'],
}))
class CustomerProfileView extends PureComponent {
  state = {
    operationkey: 'contactPersons',
  }

  static propTypes = {
    contact: PropTypes.object,
  };

  static defaultProps = {
    contact: {},
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/contact/view/:id').exec(location.pathname);
    if (match) {
      dispatch({ type: 'contact/query', payload: { id: match[1] } });
    }
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {
    const { dispatch, contact } = this.props;
    const { loading, modalVisible, success, data } = contact;

    const action = (
      <div>
        <Authorized authority="UPDATE_CONTACT">
          <Button
            icon="edit"
            onClick={this.onPatientProfileEditClickHandler}
          >Edit Contact Details
          </Button>
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
          <Description term="">&nbsp;</Description>
          <Description term="Customer Category">{data.customerCategory ? data.customerCategory.name : 'Not specified'}</Description>
          <Description term="Vendor Category">{data.vendorCategory ? data.vendorCategory.name : 'Not specified'}</Description>
          <Description term="Identification Type">{data.identification ? data.identification.name : 'Not specified'}</Description>
          <Description term="Identification">{data.identification ? data.identification.identification : 'Not specified'}</Description>
          <Description term="Country">{data.address.country.countryName}</Description>
          <Description term="City / Town">{data.address.city}</Description>
          <Description term="Physical / Street Address">{data.address.streetAddress ? data.address.streetAddress : 'Not specified'}</Description>
          <Description term="">&nbsp;</Description>
          <Description term="Postal Code">{data.address.postalCode ? data.address.postalCode : 'Not specified'}</Description>
          <Description term="Postal Address">{data.address.postalAddress ? data.address.postalAddress : 'Not specified'}</Description>
          <Description term="Phone Number">{data.phoneNumber ? data.phoneNumber : 'Not specified'}</Description>
          <Description term="Alternative Phone Number">{data.alternativePhoneNumber ? data.alternativePhoneNumber : 'Not specified'}</Description>
          <Description term="Email Address">{data.emailAddress ? data.emailAddress : 'Not specified'}</Description>
          <Description term="Alternative Email Address">{data.alternativeEmailAddress ? data.alternativeEmailAddress : 'Not specified'}</Description>
          <Description term="Alternative Email Address">{data.website ? data.website : 'Not specified'}</Description>
        </DescriptionList>
      );
    }

    const tabList = [{
      key: 'contactDetails',
      tab: 'Contact Details',
    }, {
      key: 'contactPersons',
      tab: 'Contact Persons',
    }, {
      key: 'attachments',
      tab: 'Attachments',
    }, {
      key: 'purchasePreferences',
      tab: 'Purchase Preferences',
    }, {
      key: 'vendorPurchaseItems',
      tab: 'Vendor Purchase Items',
    }];

    let contentList = {};
    if (data.id) {
      contentList = {
        contactDetails: <ContactDetailsView contactProfile={data} />,
        contactPersons: <ContactPersonsView contactProfile={data} />,
        attachments: <FilesView context={data.publicId} contextType="CONTACT" />,
        purchasePreferences: <p>Empty</p>,
        vendorPurchaseItems: <p>Empty</p>,
      };
    }

    return (
      <PageHeaderLayout
        title={data.code ? `Code: ${data.code}` : 'Code: Not specified'}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={action}
        content={description}
        tabList={tabList}
        onTabChange={this.onOperationTabChange}
      >
        <Card>{contentList[this.state.operationkey]}</Card>
      </PageHeaderLayout>
    );
  }
}

export default CustomerProfileView;
