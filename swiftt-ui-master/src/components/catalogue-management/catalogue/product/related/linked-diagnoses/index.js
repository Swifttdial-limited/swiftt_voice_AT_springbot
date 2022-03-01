import PropTypes from 'prop-types';
import React from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Icon,
  Modal,
  LocaleProvider
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const confirm = Modal.confirm;

function LinkedDiagnosesView({
  loading,
  product,
  onDiagnosesAdd,
  onDiagnosesRemove,
}) {

   function handleDiagnosisMenuClick(record, e) {
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        onDiagnosesRemove(record.code);
      },
    });
  }

  const diagnosesColumns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: 'Version',
      dataIndex: 'diagnosisVersion',
      key: 'diagnosisVersion',
    }, {
      title: '',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <Button type="dashed" shape="circle" icon="delete" onClick={handleDiagnosisMenuClick.bind(null, record)} />
        );
      },
    },
  ];

  const diagnosesToolbar = (
    <Row gutter={24}>
      <Col style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={onDiagnosesAdd} icon="plus">Add Linked Diagnosis</Button>
      </Col>
    </Row>
  );

  return (
    <div>
      <LocaleProvider locale={enUS}>
        <Table
          title={() => diagnosesToolbar}
          pagination={false}
          loading={loading}
          rowKey={record => record.code}
          dataSource={product.diagnoses}
          columns={diagnosesColumns}
          size="small"
        />
      </LocaleProvider>
    </div>
  );
}

LinkedDiagnosesView.propTypes = {
  loading: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
};

export default LinkedDiagnosesView;
