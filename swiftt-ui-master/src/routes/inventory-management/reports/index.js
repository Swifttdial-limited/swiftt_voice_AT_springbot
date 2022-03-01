import React from 'react';
import { Link } from 'dva/router';
import { Card, Button, Icon, List } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Ellipsis from '../../../components/Ellipsis';
import styles from './index.less';

const reports = [
  {
    key: 'purchaseOrders',
    icon: 'file-text',
    link: '/reports/purchase-orders',
    title: 'Purchase Orders',
    description: 'Document showing products and/or services issued by a vendor',
  }, {
    key: 'inventoryActivities',
    icon: 'rise',
    link: '/reports/inventory-activities',
    title: 'Inventory Activities',
    description: 'Report showing activity of inventory items between specified date in a certain location',
  }, {
    key: 'inventoryBalancesAndValuation',
    icon: 'calculator',
    link: '/reports/inventory-balances-and-valuation',
    title: 'Inventory Balances and Valuation',
    description: 'Report showing list of all inventory items with respective stock balances and valuation',
  }, {
    key: 'inventoryTransfers',
    icon: 'arrows-alt',
    link: '/reports/inventory-transfers',
    title: 'Inventory Transfers',
    description: 'Report showing movement for inventory items between stores or locations',
  }, {
    key: 'inventoryExpiries',
    icon: 'schedule',
    link: '/reports/inventory-expiries',
    title: 'Inventory Expiries',
    description: 'Report showing inventory items in stock with expiries and their current balance',
  }, {
    key: 'inventoryBalanceThresholds',
    icon: 'bell',
    link: '/reports/inventory-reorder-levels',
    title: 'Inventory Re-Order levels',
    description: 'Minimum quantity an item holds in a store/location before re-stocking',
  },
];

function InventoryReportsView() {
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
      title="Inventory Reports"
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

export default InventoryReportsView;
