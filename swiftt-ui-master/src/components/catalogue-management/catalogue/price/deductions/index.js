import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PriceDeductionsList from './List';
import PriceDeductionModal from './Modal';
import PriceDeductionToolbar from './Toolbar';

@connect(({ price_deductions, loading }) => ({
  price_deductions,
  loading: loading.effects['price_deductions/query']
}))
class PriceDeductionsView extends PureComponent {

  static propTypes = {
    priceProfile: PropTypes.object.isRequired,
    loadData: PropTypes.bool.isRequired,
    price_deductions: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { loadData, dispatch, priceProfile } = this.props;
    dispatch({ type: 'price_deductions/purge' });
    if (loadData) { dispatch({ type: 'price_deductions/query', payload: { id: priceProfile.id } }); }
  }

  render() {
    const { location, dispatch, price_deductions, priceProfile } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType } = price_deductions;

    const priceDeductionModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      priceProfile,
      onOk(values) {
        const data = {
          id: priceProfile.id,
          priceDeduction: values,
        };

        dispatch({ type: `price_deductions/${modalType}`, payload: data });
      },
      onCancel() {
        dispatch({ type: 'price_deductions/hideModal' });
      },
    };

    const priceDeductionListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {},
      onDeleteItem(id) {
        dispatch({ type: 'price_deductions/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'price_deductions/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const priceDeductionToolbarProps = {
      onAdd() {
        dispatch({
          type: 'price_deductions/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const PriceDeductionModalGen = () => <PriceDeductionModal {...priceDeductionModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <PriceDeductionToolbar {...priceDeductionToolbarProps} />
          <PriceDeductionsList {...priceDeductionListProps} />
          <PriceDeductionModalGen />
        </Col>
      </Row>
    );
  }
}

export default PriceDeductionsView;
