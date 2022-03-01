import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import StrengthList from './List';
import StrengthSearch from './Search';
import StrengthModal from './Modal';

class StrengthsView extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_strengths/query' });
  }

  render() {
    const { dispatch, catalogue_strengths } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = catalogue_strengths;

    const strengthModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `catalogue_strengths/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'catalogue_strengths/hideModal' });
      },
    };

    const strengthListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_strengths/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_strengths/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_strengths/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const strengthSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_strengths/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'catalogue_strengths/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const StrengthModalGen = () => <StrengthModal {...strengthModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <StrengthSearch {...strengthSearchProps} />
            <StrengthList {...strengthListProps} />
            <StrengthModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

StrengthsView.propTypes = {
  catalogue_strengths: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ catalogue_strengths }) {
  return { catalogue_strengths };
}

export default connect(mapStateToProps)(StrengthsView);
