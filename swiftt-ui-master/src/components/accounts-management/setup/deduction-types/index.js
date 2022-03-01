import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import DeductionTypeList from './List';
import DeductionTypeModal from './Modal';
import DeductionTypeSearch from './Search';

@connect(({ deductionTypes, loading }) => ({
  deductionTypes,
  loading: loading.effects['deductionTypes/query'],
}))
class DeductionTypesView extends PureComponent {

  static defaultProps = {
    deductionTypes: {},
  };

  static propTypes = {
    deductionTypes: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'deductionTypes/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'deductionTypes/purge' });
  }

  render() {
    const { dispatch, deductionTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = deductionTypes;

    const deductionModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `deductionTypes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'deductionTypes/hideModal' });
      },
    };

    const deductionListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'deductionTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'deductionTypes/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'deductionTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const deductionSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.searchQueryParam = fieldsValue.keyword; }
        }

        dispatch({ type: 'deductionTypes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'deductionTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const DeductionTypeModalGen = () => <DeductionTypeModal {...deductionModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <DeductionTypeSearch {...deductionSearchProps} />
            <DeductionTypeList {...deductionListProps} />

            <DeductionTypeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DeductionTypesView;
