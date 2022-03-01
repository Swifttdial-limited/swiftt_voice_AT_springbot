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

function ProductAssociationsView({
  loading,
  product,
  onAssociatedProductAdd,
  onAssociatedProductRemove,
}) {
  function handleAssociatedProductMenuClick(record, e) {
    confirm({
      title: 'Are you sure you want to delete this record?',
      onOk() {
        onAssociatedProductRemove(record.product.id);
      },
    });
  }

  const associatedProductColums = [
    {
      title: 'Product Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      render: (text, record) => <span>{text} ({record.product.productCode})</span>
    }, {
      title: 'Product Type',
      dataIndex: 'product.productType',
      key: 'product.productType',
      render: (text) => {
        if(text === 'MEDICATION') {
          return <span>Medication</span>
        } else if(text === 'SERVICE') {
          return <span>Service</span>;
        } else if(text === 'SUPPLIES') {
          return <span>Supplies</span>;
        } else if(text === 'PACKAGE') {
          return <span>Package</span>;
        }
      }
    }, {
      title: 'Billable',
      dataIndex: 'billable',
      key: 'billable',
      render: (text) => <span>{text ? 'Yes' : 'No'}</span>
    }, {
      title: '',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <Button type="dashed" shape="circle" icon="delete" onClick={handleAssociatedProductMenuClick.bind(null, record)} />
        );
      },
    },
  ];

  const associatedProductsToolbar = (
    <Row gutter={24}>
      <Col style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={onAssociatedProductAdd} icon="plus">Add Associated Products</Button>
      </Col>
    </Row>
  );

  return (
    <div>
      <LocaleProvider locale={enUS}>
        <Table
          title={() => associatedProductsToolbar}
          pagination={false}
          loading={loading}
          rowKey={record => record.id}
          dataSource={product.associatedProducts}
          columns={associatedProductColums}
          size="middle"
        />
      </LocaleProvider>
    </div>
  );
}

ProductAssociationsView.propTypes = {
  loading: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
};

export default ProductAssociationsView;
