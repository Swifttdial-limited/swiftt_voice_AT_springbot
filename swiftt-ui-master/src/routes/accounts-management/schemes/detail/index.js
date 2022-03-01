import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { Icon, message, Row, Col, Alert, Button, Card } from 'antd';

import Authorized from '../../../../utils/Authorized';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../../components/DescriptionList';
import SchemeExclusionsView from '../../../../components/accounts-management/scheme/exclusions';
import styles from './index.less';

const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';

@connect(({ scheme, loading }) => ({
  scheme,
  loading: loading.effects['scheme/query'],
}))
class SchemeView extends PureComponent {
  state = {
    operationkey: 'exclusions',
  }

  static propTypes = {
    scheme: PropTypes.object,
  };

  static defaultProps = {
    scheme: {},
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const match = pathToRegexp('/accounts/scheme/view/:publicId').exec(location.pathname);
    if (match) {
      dispatch({ type: 'scheme/query', payload: { publicId: match[1] } });
    }
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {
    const { dispatch, scheme } = this.props;
    const { loading, modalVisible, success, data } = scheme;

    const action = (
      <div>
        <Authorized authority="UPDATE_SCHEME">
          <Button
            icon="edit"
            onClick={this.onPatientProfileEditClickHandler}
          >Edit Details
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
          <Description term="Status">{data.active ? 'Yes' : 'No'}</Description>
          <Description term="Expiry Date">{moment(data.expiryDate).format(dateFormat)}</Description>
          <Description term="">&nbsp;</Description>
          <Description term="Phone Number">{data.phoneNumber ? data.phoneNumber : 'Not specified'}</Description>
          <Description term="Alternative Phone Number">{data.alternativePhoneNumber ? data.alternativePhoneNumber : 'Not specified'}</Description>
          <Description term="Email Address">{data.emailAddress ? data.emailAddress : 'Not specified'}</Description>
          <Description term="Alternative Email Address">{data.emailAddress ? data.emailAddress : 'Not specified'}</Description>
        </DescriptionList>
      );
    }

    const tabList = [{
      key: 'exclusions',
      tab: 'Exclusions',
    }];

    let contentList = {};
    if (data.id) {
      contentList = {
        exclusions: <SchemeExclusionsView />,
      };
    }

    return (
      <PageHeaderLayout
        title={data.name ? data.name : null}
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

export default SchemeView;
