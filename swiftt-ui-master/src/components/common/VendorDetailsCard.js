import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import DescriptionList from '../DescriptionList';

const { Description } = DescriptionList;

function VendorDetailsCard({
  vendor,
}) {
  let description = <DescriptionList size="small" col="2" />;
  if (vendor.id) {
    description = (
      <DescriptionList size="small" col="2">
        <Description term="Created By">B</Description>
        <Description term="Created At">A</Description>
        <Description term="">&nbsp;</Description>
      </DescriptionList>
    );
  }

  return (
    <Fragment>
      {description}
    </Fragment>    
  );
}

VendorDetailsCard.propTypes = {
  vendor: PropTypes.object.isRequired,
};

export default VendorDetailsCard;
