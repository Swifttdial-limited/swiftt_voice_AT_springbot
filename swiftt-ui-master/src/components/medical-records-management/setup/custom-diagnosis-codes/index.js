import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import DiagnosisCodeList from './List';
import DiagnosisCodeSearch from './Search';
import DiagnosisCodeModal from './Modal';

@connect(({ diagnosisCodes, loading }) => ({
  diagnosisCodes,
  loading: loading.effects['diagnosisCodes/query']
}))
class DiagnosisCodesView extends PureComponent {

  static propTypes = {
    diagnosisCodes: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'diagnosisCodes/query' });
  }

  render() {
    const { dispatch, diagnosisCodes } = this.props;

    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = diagnosisCodes;

    const diagnosisCodeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `diagnosisCodes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'diagnosisCodes/hideModal' });
      },
    };

    const diagnosisCodeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'diagnosisCodes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'diagnosisCodes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'diagnosisCodes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const diagnosisCodeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'diagnosisCodes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'diagnosisCodes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const DiagnosisCodeModalGen = () => <DiagnosisCodeModal {...diagnosisCodeModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <DiagnosisCodeSearch {...diagnosisCodeSearchProps} />
            <DiagnosisCodeList {...diagnosisCodeListProps} />
            <DiagnosisCodeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DiagnosisCodesView;
