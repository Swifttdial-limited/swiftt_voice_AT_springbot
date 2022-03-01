import React from 'react';
import { Link } from 'dva/router';
import { Card, Button, Icon, List } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Ellipsis from '../../../components/Ellipsis';
import styles from './index.less';

const reports = [
  {
    key: 'specialistsListing',
    icon: 'file-text',
    link: '/reports/specialists-listing',
    title: 'Specialists Listing',
    description: 'Listing users by speciality',
  },
  {
    key: 'assetdepreciation',
    icon: 'switcher',
    link: '/reports/fixed-asset-listing',
    title: 'Fixed Asset Report',
    description: 'Listing assets and depreciation',
  },
];

function OtherReportsView() {
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
      title="Other Reports"
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
                  <Icon type="plus" />
                </Button>
              </List.Item>
            )
          )}
        />
      </div>
    </PageHeaderLayout>
  );
}

export default OtherReportsView;
