import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DiagnosesList from '../../../components/knowledge-base/diagnoses/List';
import DiagnosesSearch from '../../../components/knowledge-base/diagnoses/Search';

@connect(({ diagnoses, loading }) => ({
  diagnoses,
  loading: loading.effects['diagnoses/query'],
}))
class DiagnosesManagementView extends PureComponent {

  static propTypes = {
    diagnoses: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'diagnoses/query' });
  }

  render() {
    const { diagnoses, dispatch } = this.props;
    const { loading, list, pagination, success } = diagnoses;

    const diagnosisListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'diagnoses/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    const diagnosisSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'searchQueryParam') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }
        dispatch({ type: 'diagnoses/query', payload });
      },
    };

    return (
      <PageHeaderLayout
        title="Diagnoses"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col>
              <DiagnosesSearch {...diagnosisSearchProps} />
              <DiagnosesList {...diagnosisListProps} />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default DiagnosesManagementView;
