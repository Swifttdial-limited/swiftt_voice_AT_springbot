import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { Row, Col, Divider, Tag, Tabs } from 'antd';
import DescriptionList from '../../DescriptionList';

const { Description } = DescriptionList;

const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

function EncounterSummaryCard({ visit }) {

    const renderVisitStatusTag = () => {
        switch (visit.status) {
          case 'NEW':
            return <Tag color="magenta">NEW</Tag>;
          case 'ACTIVE':
            return <Tag color="green">IN PROGRESS</Tag>;
          case 'CLOSED':
            return <Tag color="red">CLOSED</Tag>;
          case 'AWAITING_CONFIRMATION':
            return <Tag color="purple">AWAITING CONFIRMATION</Tag>;
          case 'PENDING_ADMISSION':
            return <Tag color="purple">PENDING ADMISSION</Tag>;
          case 'PENDING_PAYMENT':
            return <Tag color="purple">PENDING PAYMENT</Tag>;
          case 'PENDING_BILL_PAYMENT':
            return <Tag color="purple">PENDING BILL PAYMENT</Tag>;
          case 'PENDING_DISCHARGE':
            return <Tag color="purple">PENDING DISCHARGE</Tag>;
          default:
            return <Tag color="blue">{visit.status}</Tag>;
        }
      };
  

    return (
        <div>
            {visit && (
                <DescriptionList size="small" columns={3}>
                    <Description term="Visit Type">{visit.visitType.name}</Description>
                    <Description term="Default Payment Wallet">{visit.defaultPaymentWallet.walletType.name}</Description>
                    <Description term="Visit Time">{moment(visit.creationDate).format(dateTimeFormat)}</Description>
                    <Description term="Discharge Time"></Description>
                    <Description term="Booked By">{visit.createdBy ? visit.createdBy.username : 'Not Specified'}</Description>
                    <Description term="Status">{renderVisitStatusTag()}</Description>
                    <Description term="Description">{visit.description ? visit.description : 'None'}</Description>
                </DescriptionList>
            )}
            {visit.emergencyDetails && (
                <div>
                    <Divider />
                    <DescriptionList className={styles.headerList} size="small" col="3">
                        <Description term="Accompanied By">{visit.emergencyDetails.accompaniedBy}</Description>
                        <Description term="Received By">{visit.emergencyDetails.receivedBy}</Description>
                        <Description term="Attending Doctor">{visit.emergencyDetails.attendingDoctor}</Description>
                        <Description term="Chief Complaints">{visit.emergencyDetails.chiefComplaints}</Description>
                        <Description term="Department">{visit.emergencyDetails.department.name}</Description>
                        <Description term="Description">{visit.emergencyDetails.description}</Description>
                        <Description term="Has Relatives Notified">{visit.emergencyDetails.hasRelativesNotified ? 'Yes' : 'No'}</Description>
                        <Description term="Means of Arrival">{visit.emergencyDetails.meansOfArrival.name}</Description>
                        <Description term="Medical Jurisprudence">{visit.emergencyDetails.medicalJurisprudence.name}</Description>
                        <Description term="Referral Doctor">{visit.emergencyDetails.referralDoctor}</Description>
                    </DescriptionList>
                </div>
            )}
    </div>

    );
}

EncounterSummaryCard.defaultProps = {
    detailed: false,
    visit: {},
};

EncounterSummaryCard.propTypes = {
    detailed: PropTypes.bool,
    visit: PropTypes.object.isRequired,
};

export default EncounterSummaryCard;
