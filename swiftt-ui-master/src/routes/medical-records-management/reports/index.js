import React from 'react';
import { Link } from 'dva/router';
import { Card, Button, Icon, List } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Ellipsis from '../../../components/Ellipsis';
import styles from './index.less';

const reports = [
  {
    key: 'patientsListing',
    icon: 'idcard',
    link: '/reports/patient-listing',
    title: 'Patients Listing',
    description: 'This reports provides listing of all registered patients based on demographics data and patient profile',
  }, {
    key: 'patientVisitHistory',
    icon: 'calendar',
    link: '/reports/patient-visit-history',
    title: 'Visit History',
    description: 'The report provides a listing of patient encounters to the health facility.',
  }, {
    key: 'patientStatement',
    icon: 'profile',
    link: '/reports/patient-statement',
    title: 'Patient Statement',
    description: 'Detailed patient bill that shows requested transactions, dates, charges and payments made',
  }, {
    key: 'appointmentListing',
    icon: 'schedule',
    link: '/reports/appointments-listing',
    title: 'Appointments Listing',
    description: 'Listing of scheduled appointments on medical practice',
  }, {
    key: 'departmentalVisit',
    icon: 'shop',
    link: '/reports/departmental-requests',
    title: 'Departmental Visits',
    description: 'Similar to visit history report but filtered to encounters within certain departments in the health facility.',
  },
];

function MedicalRecordsReportsView() {
  const content = (
    <div className={styles.pageHeaderContent}>
      {/* <p>Description here</p> */}
      <div className={styles.contentLink} />
    </div>
  );

  const extraContent = (
    <div className={styles.extraImg}>
      <img alt="这是一个标题" src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" />
    </div>
  );

  return (
    <PageHeaderLayout
      title="Medical Records Reports"
      content={content}
      extraContent={extraContent}
    >
      <div className={styles.cardList}>
        <List
          rowKey="key"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={[...reports]}
          renderItem={item => (item ? (
            <List.Item key={item.key}>
              <Link to={item.link}>
                <Card hoverable className={styles.card}>
                  <Card.Meta
                    avatar={<Icon type={item.icon} className={styles.cardAvatar} />}
                    title={item.title}
                    description={(
                      <Ellipsis className={styles.item} lines={3}>{item.description}</Ellipsis>
                    )}
                  />
                </Card>
              </Link>
            </List.Item>
            ) : (
              <List.Item>
                <Button type="dashed" className={styles.newButton}>
                  <Icon type="plus" /> 新增产品
                </Button>
              </List.Item>
            )
          )}
        />
      </div>
    </PageHeaderLayout>
  );
}

export default MedicalRecordsReportsView;
