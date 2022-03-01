import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import { Icon, Tabs, Card } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AccountsSetupDefinitionsView from '../../../components/accounts-management/setup/definitions';
import AccountCategoriesView from '../../../components/accounts-management/setup/account-categories';
import AccountsView from '../../../components/accounts-management/setup/accounts';
import CustomerCategoriesView from '../../../components/accounts-management/setup/customer-categories';
import ChargeTypesView from '../../../components/accounts-management/setup/charge-types';
import DeductionTypesView from '../../../components/accounts-management/setup/deduction-types';
import PaymentModesView from '../../../components/accounts-management/setup/payment-modes';
import PaymentTermsView from '../../../components/accounts-management/setup/payment-terms';
import TagTypesView from '../../../components/accounts-management/setup/tag-types';
import TagsView from '../../../components/accounts-management/setup/tags';
import TaxTypesView from '../../../components/accounts-management/setup/tax-types';
import TaxCodesView from '../../../components/accounts-management/setup/tax-codes';
import TradingCurrenciesView from '../../../components/accounts-management/setup/trading-currencies';
import VendorCategoriesView from '../../../components/accounts-management/setup/vendor-categories';

const TabPane = Tabs.TabPane;

function AccountsSetup() {

  return (
    <PageHeaderLayout
      title="Accounting setup"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div className="content-inner">
        <Tabs tabPosition="left" defaultActiveKey="accounts">
          <TabPane tab={<span> Chart of Accounts </span>} key="accounts">
            <AccountsView />
          </TabPane>
          <TabPane tab={<span> Account Categories </span>} key="accountCategories">
            <Card title="Account Categories">
              <AccountCategoriesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Preferences </span>} key="preferences">
            <Card title="Preferences">
              <AccountsSetupDefinitionsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Trading Currencies</span>} key="tradingCurrencies">
            <Card title="Trading Currencies">
              <TradingCurrenciesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Charge Types </span>} key="chargeTypes">
            <Card title="Charge Types">
              <ChargeTypesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Deduction Types </span>} key="deductionTypes">
            <Card title="Deduction Types">
              <DeductionTypesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Modes of Payment </span>} key="paymentModes">
            <Card title="Modes of Payment">
              <PaymentModesView />
            </Card>
          </TabPane>
          {/*
          <TabPane tab={< span> Customer Categories </span>} key="customerCategories">
              <Card title="Customer Categories">
                  <CustomerCategoriesView/>
              </Card>
          </TabPane>
          <TabPane tab={< span> Vendor Categories </span>} key="vendorCategories">
              <Card title="Vendor Categories">
                  <VendorCategoriesView/>
              </Card>
          </TabPane>
          */}
          <TabPane tab={<span> Tag Types </span>} key="tagTypes">
            <Card title="Tag Types">
              <TagTypesView />
            </Card>
          </TabPane>
          <TabPane tab={<span>Tags</span>} key="tags">
            <Card title="Tags">
              <TagsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Payment Terms </span>} key="paymentTerms">
            <Card title="Payment Terms">
              <PaymentTermsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Tax Types </span>} key="taxTypes">
            <Card title="Tax Types">
              <TaxTypesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Tax Rates </span>} key="taxRates">
            <Card title="Tax Rates">
              <TaxCodesView />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderLayout>
  );
}

export default AccountsSetup;
