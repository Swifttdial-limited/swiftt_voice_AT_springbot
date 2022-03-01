import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import VisitTypeList from './List';
import VisitTypeSearch from './Search';
import VisitTypeModal from './Modal';

class VisitTypesView extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'visitTypes/query' });
  }

  render() {
    const { location, dispatch, visitTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = visitTypes;

    const visitTypeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `visitTypes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'visitTypes/hideModal' });
      },
    };

    const visitTypeListProps = {
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
        dispatch({ type: 'visitTypes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'visitTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const visitTypeSearchProps = {
      onSearch(fieldsValue) {
        fieldsValue.keyword.length
          ? dispatch(routerRedux.push({
            pathname: '/table/visitTypes',
            query: {
              field: fieldsValue.field,
              keyword: fieldsValue.keyword,
            },
          }))
          : dispatch(routerRedux.push({ pathname: '/table/visitTypes' }));
      },
      onAdd() {
        dispatch({
          type: 'visitTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const VisitTypeModalGen = () => <VisitTypeModal {...visitTypeModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <VisitTypeSearch {...visitTypeSearchProps} />
            <VisitTypeList {...visitTypeListProps} />
            <VisitTypeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

VisitTypesView.propTypes = {
  visitTypes: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ visitTypes }) {
  return { visitTypes };
}

export default connect(mapStateToProps)(VisitTypesView);
