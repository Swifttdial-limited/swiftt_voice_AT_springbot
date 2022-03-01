import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import LocationTypeList from './List';
import LocationTypeSearch from './Search';
import LocationTypeModal from './Modal';

@connect(({ locationTypes, loading }) => ({
  locationTypes,
  loading: loading.effects['locationTypes/query'],
}))
class LocationTypesView extends PureComponent {
  
  static propTypes = {
    locationTypes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'locationTypes/query' });
  }

  render() {
    const { dispatch, locationTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = locationTypes;

    const locationTypeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({
          type: `locationTypes/${modalType}`,
          payload: Object.assign({}, currentItem, data),
        });
      },
      onCancel() {
        dispatch({ type: 'locationTypes/hideModal' });
      },
    };

    const locationTypeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'locationTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'locationTypes/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'locationTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const locationTypeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'locationTypes/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'locationTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const LocationTypeModalGen = () =>
      <LocationTypeModal {...locationTypeModalProps} />;

    return (
      <Card title="Location Types">
        <LocationTypeSearch {...locationTypeSearchProps} />
        <LocationTypeList {...locationTypeListProps} />
        <LocationTypeModalGen />
      </Card>
    );
  }
}

export default LocationTypesView;
