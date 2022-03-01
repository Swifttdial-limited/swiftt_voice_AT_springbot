import React from 'react';
import { Link } from 'dva/router';
import { Card, Button, Icon, List } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Ellipsis from '../../../components/Ellipsis';
import styles from './index.less';

const reports = [
  // {
  //   key: 'Accounts Balances',
  //   title: 'Accounts Balances',
  //   icon: 'book',
  //   link: '/reports/medical-records/patient-visit-history',
  //   // description: '',
  // },
  {
    key: 'accounts-listing',
    icon: 'bars',
    link: '/reports/account-listing',
    title: 'Accounts Listing',
    description: 'Listing of all accounts in your organization\'s chart of accounts; by name and category',
  },

  {
    key: 'Cash book',
    title: 'Cash book',
    icon: 'book',
    link: '/reports/cash-book',
    description: 'Financial report that contains all cash receipts and payments, including bank deposits and withdrawals.',
  }, 
  // {
  //   key: 'Cash flow Statement',
  //   title: 'Cash flow Statement',
  //   icon: 'shop',
  //   link: '/reports/cash-flow',
  //   // description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  // },
   {
    key: 'customer-statements',
    icon: 'idcard',
    link: '/reports/customer-statements',
    title: 'Customer Statement',
    description: 'Summarize all the invoices and payments for a customer between two dates',
  },
  {
    key: 'customer-aging',
    icon: 'idcard',
    link: '/reports/customer-aging',
    title: 'Customer Aging',
    // description: 'Summarize all the invoices and payments for a customer between two dates',
  },
  {
    key: 'cashier-collection-analysis',
    title: 'Cashier Collection Analysis',
    icon: 'solution',
    link: '/reports/cashier-collection-analysis',
    // description: 'Financial report that accounts for all of the cash and cash equivalents collected by cashier\'s in order to close out their cash drawers at the end of a day, shift, or open period.',
  }, 
  {
    key: 'cashier-collection-summary',
    title: 'Cashier Collection Summary',
    icon: 'solution',
    link: '/reports/cashier-collection-summary',
    // description: 'Financial report that accounts for all of the cash and cash equivalents collected by cashier\'s in order to close out their cash drawers at the end of a day, shift, or open period.',
  },
  {
    key: 'Balance sheet',
    title: 'Balance sheet',
    icon: 'shop',
    link: '/reports/balance-sheet',
    description: 'In financial accounting, a balance sheet or statement of financial position is a summary of the financial balances of an individual or organization.',
  },
  {
    key: 'General Ledger',
    title: 'General Ledger',
    icon: 'shop',
    link: '/reports/general-ledger',
    // description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  },
  {
    key: 'Income Statement',
    title: 'Income Statement',
    icon: 'shop',
    link: '/reports/income-statement',
    // description: 'Paragraphs indicate: Ant gold service design platform ant.design, with minimal effort, seamless access to ant gold service ecology, providing experience across the design and development solutions.',
  },
  {
    key: 'trial-balance',
    title: 'Trial Balance',
    icon: 'block',
    link: '/reports/trial-balance',
    description: 'It shows a summary of how much Cash, Accounts Receivable, Supplies, etc. the company has after the posting process.',
  },
  {
    key: 'vendor-statements',
    icon: 'idcard',
    link: '/reports/vendor-statements',
    title: 'Vendor Statement',
    description: 'Summarize all the supplier/vendor invoices at a certain date.',
  },
  {
    key: 'vendor-aging',
    icon: 'idcard',
    link: '/reports/vendor-aging',
    title: 'Vendor Aging',
    // description: 'Summarize all the invoices and payments for a customer between two dates',
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
      title="Financial Reports"
      content={content}
      extraContent={extraContent}
    >
      <div className={styles.cardList}>
        <List
          rowKey="key"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={[...reports]}
          renderItem={item => (
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
          )}
        />
      </div>
    </PageHeaderLayout>
  );
}

export default MedicalRecordsReportsView;
