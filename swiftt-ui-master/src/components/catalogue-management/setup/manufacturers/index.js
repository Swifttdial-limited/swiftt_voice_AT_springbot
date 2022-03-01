import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import ManufacturerList from './List';
import ManufacturerSearch from './Search';
import ManufacturerModal from './Modal';

class ManufacturersView extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_manufacturers/query' });
  }

  render() {
    const { dispatch, catalogue_manufacturers } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = catalogue_manufacturers;

    const manufacturerModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `catalogue_manufacturers/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'catalogue_manufacturers/hideModal' });
      },
    };

    const manufacturerListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_manufacturers/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_manufacturers/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_manufacturers/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const manufacturerSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_manufacturers/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'catalogue_manufacturers/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ManufacturerModalGen = () => <ManufacturerModal {...manufacturerModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <ManufacturerSearch {...manufacturerSearchProps} />
            <ManufacturerList {...manufacturerListProps} />
            <ManufacturerModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

ManufacturersView.propTypes = {
  catalogue_manufacturers: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ catalogue_manufacturers }) {
  return { catalogue_manufacturers };
}

export default connect(mapStateToProps)(ManufacturersView);
