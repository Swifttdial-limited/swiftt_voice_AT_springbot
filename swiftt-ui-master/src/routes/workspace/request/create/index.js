import PropTypes from 'prop-types';
import React from 'react';

import RequestForm from '../../../../components/common/requests/medication/Form';


function RequestFormRegistrationView() {
  const formProps = {
    formType: 'create',
  };

  return (
    <div className="content-inner">

      <RequestForm {...formProps} />
    </div>
  );
}

export default RequestFormRegistrationView;
