import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import FormulationList from './List';
import FormulationSearch from './Search';
import FormulationModal from './Modal';

class FormulationsView extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_formulations/query' });
  }

  render() {
    const { dispatch, catalogue_formulations } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = catalogue_formulations;

    const formulationModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `catalogue_formulations/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'catalogue_formulations/hideModal' });
      },
    };

    const formulationListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_formulations/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_formulations/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_formulations/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const formulationSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_formulations/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'catalogue_formulations/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const FormulationModalGen = () => <FormulationModal {...formulationModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <FormulationSearch {...formulationSearchProps} />
            <FormulationList {...formulationListProps} />
            <FormulationModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

FormulationsView.propTypes = {
  catalogue_formulations: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ catalogue_formulations }) {
  return { catalogue_formulations };
}

export default connect(mapStateToProps)(FormulationsView);
