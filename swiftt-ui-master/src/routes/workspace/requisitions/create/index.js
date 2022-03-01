import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import RequisitionForm from '../../../../components/procurement-management/requisition/Form';

@connect(({ requisitions }) => ({
  requisitions
}))
class RequisitionRegistrationView extends PureComponent {
  static propTypes = {
    requisitions: PropTypes.object,
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type : 'requisitions/purgeCurrentItem' });
  }

  render() {
    const {
      dispatch,
      requisitions
    } = this.props;

    const requisitionFormProps = {
      requisition: requisitions.currentItem,
      onCreate(data) {
        const payload = Object.assign({}, data, { fromWorkspace: true });
        dispatch({ type: 'requisition/create', payload: payload });
      },
      onCreateAndSubmit(data) {
        const payload = Object.assign({}, data, { fromWorkspace: true });
        dispatch({ type: 'requisition/createAndSubmit', payload: payload });
      },
    };

    return (
      <PageHeaderLayout
        title="New Requisition"
        content="Purchase requisition is a request sent internally within a company to obtain purchased goods and services telling the purchasing department exactly what items and services are requested, the quantity, source and associated costs."
      >
        <div className="content-inner">
          <RequisitionForm {...requisitionFormProps} />
        </div>
      </PageHeaderLayout>
    );
  }
}

export default RequisitionRegistrationView;
