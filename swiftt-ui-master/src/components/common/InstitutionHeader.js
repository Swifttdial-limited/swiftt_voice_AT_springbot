import React from 'react';

const InstitutionHeader = ({ institution }) => {
    return (
        <span>

            <h2>{institution.legalName ? institution.legalName : ""}</h2>
            {`${institution.address.postalAddress} - ${institution.address.postalCode}`}<br />
            {`${institution.address.streetAddress}`}<br />
            {institution.websiteUrl}<br />
            {institution.tagline}

        </span>

    );
}

export default InstitutionHeader;