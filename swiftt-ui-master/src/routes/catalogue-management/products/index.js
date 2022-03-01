import React from 'react';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProductsView from '../../../components/catalogue-management/catalogue/products';

function ProductsCatalogue() {
  return (
    <PageHeaderLayout
      title="Products"
      content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
    >
      <div className="content-inner">
        <ProductsView />
      </div>
    </PageHeaderLayout>
  );
}

export default ProductsCatalogue;
