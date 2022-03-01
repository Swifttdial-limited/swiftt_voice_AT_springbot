import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import AdministrationRouteList from './List';
import AdministrationRouteSearch from './Search';
import AdministrationRouteModal from './Modal';

class AdministrationRoutesView extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_administrationroutes/query' });
  }

  render() {
    const { dispatch, catalogue_administrationroutes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = catalogue_administrationroutes;

    const administrationRouteModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `catalogue_administrationroutes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'catalogue_administrationroutes/hideModal' });
      },
    };

    const administrationRouteListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_administrationroutes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_administrationroutes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_administrationroutes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const administrationRouteSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_administrationroutes/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'catalogue_administrationroutes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const AdministrationRouteModalGen = () => <AdministrationRouteModal {...administrationRouteModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <AdministrationRouteSearch {...administrationRouteSearchProps} />
            <AdministrationRouteList {...administrationRouteListProps} />
            <AdministrationRouteModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

AdministrationRoutesView.propTypes = {
  catalogue_administrationroutes: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ catalogue_administrationroutes }) {
  return { catalogue_administrationroutes };
}

export default connect(mapStateToProps)(AdministrationRoutesView);
