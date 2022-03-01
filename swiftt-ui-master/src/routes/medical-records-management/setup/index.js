import PropTypes from 'prop-types';
import React from 'react';
import { Card, Tabs } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AppointmentTypesView from '../../../components/medical-records-management/setup/appointment-types';
import CustomDiagnosisCodesView from '../../../components/medical-records-management/setup/custom-diagnosis-codes';
import DischargeDispositionsView from '../../../components/medical-records-management/setup/discharge-dispositions';
import HandOverReasonsView from '../../../components/medical-records-management/setup/handover-reasons';
import PreferencesView from '../../../components/medical-records-management/setup/preferences';
import SpecimensView from '../../../components/medical-records-management/setup/specimens';
import VisitTypesView from '../../../components/medical-records-management/setup/visit-types';
import MeansOfArrivalView from '../../../components/medical-records-management/setup/means-of-arrival';
import MedicoLegalsView from '../../../components/medical-records-management/setup/medico-legal';
import TriageCategoriesView from '../../../components/medical-records-management/setup/triage-categories';

const TabPane = Tabs.TabPane;

function MedicalRecordsSetup() {
  return (
    <div className="content-inner">
      <PageHeaderLayout
        title="Medical Definitions"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <Tabs tabPosition="left" defaultActiveKey="visitTypes">
          <TabPane tab={<span>Types of Visits</span>} key="visitTypes">
            <Card title="Types of Visits">
              <VisitTypesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Preferences</span>} key="preferences">
            <Card title="Preferences">
              <PreferencesView />
            </Card>
          </TabPane>
          <TabPane tab={<span>Type of Appointments</span>} key="appointmentTypes">
            <Card title="Types of Appointments">
              <AppointmentTypesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Discharge Dispositions</span>} key="dischargeDispositions">
            <Card title="Discharge Dispositions">
              <DischargeDispositionsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Handover / Referral Reasons</span>} key="handOverReasons">
            <Card title="Handover / Referral Reasons">
              <HandOverReasonsView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Specimens</span>} key="specimens">
            <Card title="Specimens">
              <SpecimensView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Triage Categories</span>} key="triageCategories">
            <Card title="Triage Categories">
              <TriageCategoriesView />
            </Card>
          </TabPane>
          <TabPane tab={<span>Custom Diagnosis Codes</span>} key="customDiagnosisCodes">
            <Card title="Custom Diagnosis Codes">
              <CustomDiagnosisCodesView />
            </Card>
          </TabPane>
          <TabPane tab={<span> Means of Arrival</span>} key="meansOfArrival">
            <Card title="Means of Arrival">
              <MeansOfArrivalView />
            </Card>
          </TabPane>
          <TabPane tab={<span>ER Medico Legal</span>} key="medicoLegals">
            <Card title="ER Medico Legal Jurisprudence">
              <MedicoLegalsView />
            </Card>
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    </div>
  );
}

export default MedicalRecordsSetup;
