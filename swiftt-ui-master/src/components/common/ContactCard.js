import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'antd';

import DescriptionList from '../DescriptionList';

const { Description } = DescriptionList;

function ContactCard({
  contact,
  intent
}) {
  let description = (contact == null) ? (
    <DescriptionList size="small" col="1">
      <Description term={intent} />
    </DescriptionList>
  ) : (
    <DescriptionList size="small" col="1">
      <Description term={intent}>
        <p style={{ marginBottom: '0.1em' }}>{contact.name}</p>
        <p style={{ marginBottom: '0.1em' }}>{contact.address.streetAddress}</p>
        <p style={{ marginBottom: '0.1em' }}>{contact.phoneNumber}</p>
        <p style={{ marginBottom: '0.1em' }}>{contact.emailAddress}</p>
        <p style={{ marginBottom: '0.1em' }}>{contact.address.postalCode} {contact.address.postalAddress}</p>
      </Description>
    </DescriptionList>
  )

  return (
    <Card>
      {description}
    </Card>
  );
}

ContactCard.defaultProps = {
  contact: {},
};

ContactCard.propTypes = {
  contact: PropTypes.object,
};

export default ContactCard;
