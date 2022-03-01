import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import LocationList from './List';
import LocationSearch from './Search';
import LocationModal from './Modal';

@connect(({ locations, loading }) => ({
  locations,
  loading: loading.effects['locations/query'],
}))
class LocationsView extends PureComponent {
  static propTypes = {
    locations: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'locations/query' });
  }

  render() {
    const { dispatch, locations } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = locations;

    const locationModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({
          type: `locations/${modalType}`,
          payload: Object.assign({}, currentItem, data),
        });
      },
      onCancel() {
        dispatch({ type: 'locations/hideModal' });
      },
    };

    const locationListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'locations/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'locations/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'locations/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const locationSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'locations/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'locations/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const LocationModalGen = () => <LocationModal {...locationModalProps} />;

    return (
      <Card title="Locations">
        <LocationSearch {...locationSearchProps} />
        <LocationList {...locationListProps} />
        <LocationModalGen />
      </Card>
    );
  }
}

export default LocationsView;
