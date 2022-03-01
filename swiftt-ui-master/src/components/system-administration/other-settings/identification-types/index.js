import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import IdentificationTypeList from './List';
import IdentificationTypeSearch from './search';
import IdentificationTypeModal from './modal';

@connect(({ identificationTypes, loading }) => ({
  identificationTypes,
  loading: loading.effects['identificationTypes/query'],
}))
class IdentificationTypesView extends PureComponent {

  static propTypes = {
    identificationTypes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'identificationTypes/query' });
  }

  render() {
    const { dispatch, identificationTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = identificationTypes;

    const identificationTypeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({
          type: `identificationTypes/${modalType}`,
          payload: Object.assign({}, currentItem, data),
        });
      },
      onCancel() {
        dispatch({ type: 'identificationTypes/hideModal' });
      },
    };

    const identificationTypeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'identificationTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'identificationTypes/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'identificationTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const identificationTypeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'identificationTypes/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'identificationTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const IdentificationTypeModalGen = () => <IdentificationTypeModal {...identificationTypeModalProps} />;

    return (
      <Card title="Identification Types">
        <IdentificationTypeSearch {...identificationTypeSearchProps} />
        <IdentificationTypeList {...identificationTypeListProps} />
        <IdentificationTypeModalGen />
      </Card>
    );
  }
}

export default IdentificationTypesView;
