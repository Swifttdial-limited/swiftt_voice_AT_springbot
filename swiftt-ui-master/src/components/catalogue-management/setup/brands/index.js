import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import BrandList from './List';
import BrandSearch from './Search';
import BrandModal from './Modal';

class BrandsView extends PureComponent {
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_brands/query' });
  }

  render() {
    const { dispatch, catalogue_brands } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = catalogue_brands;

    const brandModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `catalogue_brands/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'catalogue_brands/hideModal' });
      },
    };

    const brandListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_brands/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_brands/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_brands/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const brandSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_brands/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'catalogue_brands/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const BrandModalGen = () => <BrandModal {...brandModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <BrandSearch {...brandSearchProps} />
            <BrandList {...brandListProps} />
            <BrandModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

BrandsView.propTypes = {
  catalogue_brands: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ catalogue_brands }) {
  return { catalogue_brands };
}

export default connect(mapStateToProps)(BrandsView);
