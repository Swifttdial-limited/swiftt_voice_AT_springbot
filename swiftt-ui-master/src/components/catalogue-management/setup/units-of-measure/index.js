import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import UnitOfMeasureList from './List';
import UnitOfMeasureSearch from './Search';
import UnitOfMeasureModal from './Modal';

class UnitsOfMeasureView extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'units_of_measure/query' });
  }

  render() {
    const { dispatch, units_of_measure } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = units_of_measure;

    const unitOfMeasureModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `units_of_measure/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'units_of_measure/hideModal' });
      },
    };

    const unitOfMeasureListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'units_of_measure/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'units_of_measure/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'units_of_measure/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const unitOfMeasureSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'units_of_measure/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'units_of_measure/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const UnitOfMeasureModalGen = () => <UnitOfMeasureModal {...unitOfMeasureModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <UnitOfMeasureSearch {...unitOfMeasureSearchProps} />
            <UnitOfMeasureList {...unitOfMeasureListProps} />
            <UnitOfMeasureModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

UnitsOfMeasureView.propTypes = {
  units_of_measure: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ units_of_measure }) {
  return { units_of_measure };
}

export default connect(mapStateToProps)(UnitsOfMeasureView);
