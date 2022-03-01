import React from 'react';
import { Link } from 'dva/router';
import { Card, Button, Icon, List } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Ellipsis from '../../../components/Ellipsis';
import styles from './index.less';

const reports = [
  {
    key: 'services',
    icon: 'idcard',
    link: '/reports/medical-records/patient-demographics',
    title: 'Services',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  }, {
    key: 'drugs',
    icon: 'calendar',
    link: '/reports/medical-records/patient-visit-history',
    title: 'Drugs',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  }, {
    key: 'consumables',
    icon: 'profile',
    link: '/reports/medical-records/patient-statement',
    title: 'Consumables',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  }, {
    key: 'packages',
    icon: 'schedule',
    link: '/reports/medical-records/appointment-listing',
    title: 'Packages',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  }, {
    key: 'priceLists',
    icon: 'shop',
    link: '/reports/medical-records/patient-department-visit',
    title: 'Price Lists',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  }, {
    key: 'productSuppliers',
    icon: 'shop',
    link: '/reports/medical-records/patient-department-visit',
    title: 'Products Suppliers',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  }, {
    key: 'barCodes',
    icon: 'shop',
    link: '/reports/medical-records/patient-department-visit',
    title: 'Bar Codes',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  }, {
    key: 'productProfitAndLoss',
    icon: 'shop',
    link: '/reports/medical-records/patient-department-visit',
    title: 'Product Profit & Loss',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  }, {
    key: 'productReorderLevel',
    icon: 'shop',
    link: '/reports/medical-records/patient-department-visit',
    title: 'Product Reorder level',
    description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  },
];

function CatalogueReportsView() {
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
      title="Catalogue Reports"
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
              <Card hoverable className={styles.card} actions={[<Link to={item.link}>View</Link>]}>
                <Card.Meta
                  avatar={<Icon type={item.icon} className={styles.cardAvatar} />}
                  title={<Link to={item.link}>{item.title}</Link>}
                  description={(
                    <Ellipsis className={styles.item} lines={3}>{item.description}</Ellipsis>
                  )}
                />
              </Card>
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

export default CatalogueReportsView;
