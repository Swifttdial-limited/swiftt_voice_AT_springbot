import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import SpecimenList from './List';
import SpecimenSearch from './Search';
import SpecimenModal from './Modal';

class SpecimensView extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'specimens/query' });
  }

  render() {
    const { location, dispatch, specimens } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = specimens;

    const specimenModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `specimens/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'specimens/hideModal' });
      },
    };

    const specimenListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        const { query, pathname } = location;
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: page.current,
            size: page.pageSize,
          },
        }));
      },
      onDeleteItem(id) {
        dispatch({ type: 'specimens/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'specimens/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const specimenSearchProps = {
      onSearch(fieldsValue) {
        fieldsValue.keyword.length
          ? dispatch(routerRedux.push({
            pathname: '/table/specimens',
            query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
            },
          }))
          : dispatch(routerRedux.push({ pathname: '/table/specimens' }));
      },
      onAdd() {
        dispatch({
          type: 'specimens/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const SpecimenModalGen = () => <SpecimenModal {...specimenModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <SpecimenSearch {...specimenSearchProps} />
            <SpecimenList {...specimenListProps} />
            <SpecimenModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

SpecimensView.propTypes = {
  specimens: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ specimens }) {
  return { specimens };
}

export default connect(mapStateToProps)(SpecimensView);
