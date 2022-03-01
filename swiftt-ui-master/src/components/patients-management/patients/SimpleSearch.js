import PropTypes from 'prop-types';
import React from 'react';
import { Form, Button, Row, Col, Card } from 'antd';

import SimpleSearch from '../../ui/search';

function search({
  field,
  keyword,
  onSearch,
  onAdd,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) {
  const searchPatientProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [
      { value: 'name', name: 'Patient Name' },
      { value: 'medicalRecordNumber', name: 'Medical Record No' },
      { value: 'phoneNumber', name: 'Phone Number' },
    ],
    selectProps: {
      defaultValue: field || 'name',
    },
    onSearch: (value) => {
      // console.log(value);
      onSearch(value);
    },
  };

  return (
    <Row gutter={24}>
      {/* <div className="portlet light"> */}
      <SimpleSearch{...searchPatientProps} />
      {/* </div> */}
    </Row>
  );
}

search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default Form.create()(search);
