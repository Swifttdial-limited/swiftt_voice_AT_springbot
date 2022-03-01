import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Table } from 'antd';
import moment from 'moment';
import Authorized from '../../../utils/Authorized';

const requestItemStatus = {
  CANCELLED: 'CANCELLED',
  POSTED: 'POSTED',
  ACTIVE: 'ACTIVE',
  NEW: 'NEW',
  COMPLETED: 'COMPLETED',
};
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

@connect(({ results, loading }) => ({
  results,
  loading: loading.effects['results/fetchRequestItems'],
}))
class ResultsView extends PureComponent {

  componentDidMount() {
    const { dispatch, encounter } = this.props;
    dispatch({
      type: 'results/queryVisitTemplateResults',
      payload: {
        encounterId: encounter.id,
        requestItemStatus: requestItemStatus.COMPLETED,
      },
    });
  }

  componentDidUpdate(prevProps) {
    const { dispatch, encounter } = this.props;
    if (encounter !== prevProps.encounter) {
      dispatch({
        type: 'results/queryVisitTemplateResults',
        payload: {
          encounterId: encounter.id,
          requestItemStatus: requestItemStatus.COMPLETED,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'results/purge' });
  }

  templateResultRange = (record) => {

    if (record.resultEntered && record.template) {
      if (record.result >= record.template.highValue) {
        return record.template.highFlag;
      } else if (record.result <= record.template.lowValue) {
        return record.template.lowFlag;
      } else if (record.template.criticalHighValue >= record.result <= record.template.criticalHighValue) {
        return record.template.criticalFlag;
      } else {
        return record.template.normalFlag;
      }
    } else {
      return record.customResultFlag;
    }
    return null;


  }
  render() {
    const { location, dispatch, results } = this.props;
    const { list, resultTemplates, loading, success } = results;

    const columns = [
      {
        title: 'Product',
        dataIndex: 'requestItem.priceListItem.product.productName',
        key: 'requestItem.priceListItem.product.productName',
        render: (text, record) => {
          if (text === undefined) {
            return <span>{record.customTemplateName}</span>
          } else {
            return <span>{text}</span>
          }
        }
      },
      {
        title: 'Investigation',
        dataIndex: 'template.name',
        key: 'template.name',
        render: (text, record) => {
          if (text === undefined) {
            return <span>{record.customTemplateName}</span>
          } else {
            return <span>{text}</span>
          }
        }
      }, {
        title: 'Results',
        dataIndex: 'result',
        key: 'result',
      },
      {
        title: 'Flag',
        dataIndex: 'result',
        key: 'result',
        render: (text, record) => {this.templateResultRange(record)}
      },
      {
        title: 'High',
        dataIndex: 'template.highValue',
        key: 'template.highValue',
        render: (text, record) => {
          if (text === undefined) {
            return <span>{record.customHighRange}</span>;
          } else {
            return <span>{text}</span>;
          }
        }
      },
      {
        title: 'Low',
        dataIndex: 'template.lowValue',
        key: 'template.lowValue',
        render: (text, record) => {
          if (text === undefined) {
            return <span>{record.customLowRange}</span>;
          } else {
            return <span>{text}</span>;
          }
        }
      },
     
      {
        title: 'Results Entered ',
        dataIndex: 'resultsEnteredDate',
        key: 'resultsEnteredDate',
        sorter: true,
        render: (text) => <span>{moment(text).format(dateTimeFormat)}</span>,
      },
      {
        title: 'Sample Date',
        dataIndex: 'sampleDateTime',
        key: 'sampleDateTime',
        sorter: true,
        render: (text) => <span>{moment(text).format(dateTimeFormat)}</span>,
      },
      {
        title: 'Created At',
        dataIndex: 'creationDate',
        key: 'creationDate',
        sorter: true,
        render: (text) => <span>{moment(text).format(dateTimeFormat)}</span>,
      },
      // {
      //   title: 'Results By',
      //   dataIndex: 'resultsEnteredBy.fullName',
      //   key: 'resultsEnteredBy.fullName',
      // },
    ];

    return (
      <Row gutter={8}>
        <Table
          bordered
          loading={loading}
          pagination={false}
          dataSource={list}
          rowKey={record => record.id}
          columns={columns}
        />
      </Row>
    );
  }
}

export default ResultsView;
