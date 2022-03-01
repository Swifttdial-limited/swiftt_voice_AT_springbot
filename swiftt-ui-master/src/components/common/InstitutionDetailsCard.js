import PropTypes from 'prop-types';
import React from 'react';

import { Card } from 'antd';

function InstitutionDetailsCard({
  institution,
}) {
  return (
    <Card title="Ship To">
      <h5>{institution.companyName}</h5>
      <h5>{institution.address.streetAddress}</h5>
      <h5>{institution.address.city}, {institution.address.country.countryName}</h5>
      <h5>{institution.phoneNumber}</h5>
      <h5>{institution.alternativePhoneNumber ? institution.alternativePhoneNumber : null}</h5>
      <h5>{institution.emailAddress ? institution.emailAddress : null}</h5>
    </Card>
  );
}

InstitutionDetailsCard.propTypes = {
  institution: PropTypes.object.isRequired,
};

export default InstitutionDetailsCard;
