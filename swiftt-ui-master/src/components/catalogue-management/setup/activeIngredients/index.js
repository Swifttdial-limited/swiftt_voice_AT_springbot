import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import ActiveIngredientList from './List';
import ActiveIngredientSearch from './Search';
import ActiveIngredientModal from './Modal';

class ActiveIngredientsView extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_activeingredients/query' });
  }

  render() {
    const { dispatch, catalogue_activeingredients } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = catalogue_activeingredients;

    const activeIngredientModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `catalogue_activeingredients/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'catalogue_activeingredients/hideModal' });
      },
    };

    const activeIngredientListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_activeingredients/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_activeingredients/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_activeingredients/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const activeIngredientSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_activeingredients/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'catalogue_activeingredients/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ActiveIngredientModalGen = () => <ActiveIngredientModal {...activeIngredientModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <ActiveIngredientSearch {...activeIngredientSearchProps} />
            <ActiveIngredientList {...activeIngredientListProps} />
            <ActiveIngredientModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

ActiveIngredientsView.propTypes = {
  catalogue_activeingredients: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ catalogue_activeingredients }) {
  return { catalogue_activeingredients };
}

export default connect(mapStateToProps)(ActiveIngredientsView);
