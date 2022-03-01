import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Spin, Form, Input, LocaleProvider, Button, Table, Alert } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import EditableCell from './ResultsTableCell';

const FormItem = Form.Item;

class RequestItemTemplatesView extends PureComponent {

  componentDidMount() {
    const { dispatch, requestItem, requestId } = this.props;
    dispatch({
      type: 'templateInvestigations/queryByRequestAndRequestItem',
      payload: {
        requestItemId: requestItem.id,
        requestId,
      },
    });
  }

  handleOk = (e) => {
    e.preventDefault();
    const { form, templateInvestigations, requestId, activeRequestItemId, handlePostResults } = this.props;
    const { getFieldValue } = form;
    const investigations = (getFieldValue('investigations') ? Object.values(getFieldValue('investigations')) : []);

    const payload = {
      requestId,
      actionType: 'FULFILL',
      requestItemId: activeRequestItemId,
      investigations,
    };
    handlePostResults(payload);
  };

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

  templateActions = (hasTemplate) => {
    const { requestItem } = this.props;
    if (hasTemplate && requestItem.status !== 'COMPLETED') {
      return (
        <div>
          <Button onClick={this.handleOk}> Post Results </Button>
          {/* <Button onClick={this.handleOk}> Back </Button> */}
        </div>
      );
    }
    // todo allow for marking an item as complete with no results
    else if(requestItem.status !== 'COMPLETED') {
      return (
        <Button onClick={this.handleOk}> Mark as Complete </Button>
      );
    }
  }
  render() {

    const { templateInvestigations, form, activeRequestItemId, requestItem } = this.props;
    const { loading, success } = templateInvestigations;
    let list = [];
    let pagination = {};
    if (activeRequestItemId && activeRequestItemId != null) {
      list = templateInvestigations[activeRequestItemId] ? templateInvestigations[activeRequestItemId].list : [];
      pagination = templateInvestigations[activeRequestItemId] ? templateInvestigations[activeRequestItemId].pagination : {};

    }

    const { getFieldDecorator } = form;


    const transform = (node, index) => {

      //  register all form components
      if (node.type === 'tag' && (node.name === 'input' || node.name === 'textarea')) {

        let finalElement = <Input key={node.attribs.id} disabled value={node.attribs.value} />
        if (node.name === 'textarea') {
          finalElement = <TextArea key={node.attribs.id} disabled rows={node.attribs.rows ? node.attribs.rows : 2} value={node.attribs.value} />
        }

        return finalElement;
      }

    }
    const options = {
      decodeEntities: true,
      transform
    };

    const templateForm = (record) => {
      if (record.description) {
        return (
          <div style={{ textAlign: 'left' }}>
            {ReactHtmlParser(record.description, options)}
          </div>
        );
      } else {
        return null;
      }
    };
    const columns = [
      {
        title: 'Template',
        dataIndex: 'template.name',
        key: 'template.name',
        render: (text, record) => {
          if(text === undefined) {
            return <span>{record.customTemplateName}</span>
          } else {
            return <span>{text}</span>
          }
        }
      }, {
        title: 'Specimen',
        dataIndex: 'template.specimen.name',
        key: 'template.specimen.name',
      }, {
        title: 'Results',
        dataIndex: 'result',
        key: 'result',
        render: (text, record) => (
          <div>
            {getFieldDecorator(`investigations[${record.id}].result`, {
              initialValue: (record.resultEntered ? record.result : ''),
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: false,
                message: 'Product must be specified.',
              }],
            })(

              <Input
                placeholder="Enter result"
                // disabled={record.resultEntered}
                addonAfter={record.template ? (record.template.unitOfMeasure ? record.template.unitOfMeasure.name : "") : (record.customUnitOfMeasure ? record.customUnitOfMeasure : null)}
                addonBefore={this.templateResultRange(record)}
              />)}
            {getFieldDecorator(`investigations[${record.id}].id`, {
              initialValue: record.id,
              rules: [{
                required: false,
              }],
            })(<Input type="hidden" />)}
            {getFieldDecorator(`investigations[${record.id}].version`, {
              initialValue: record.version,
              rules: [{
                required: false,
              }],
            })(<Input type="hidden" />)}

          </div>
        ),
      },
      {
        title: 'Range',
        dataIndex: 'template.rangeType',
        key: 'template.rangeType',
      },

      {
        title: 'Low',
        dataIndex: 'template.lowValue',
        key: 'template.lowValue',
        render: (text, record) => {
          if(text === undefined) {
            return <span>{record.customLowRange}</span>;
          } else {
            return <span>{text}</span>;
          }
        }
      },
      {
        title: 'High',
        dataIndex: 'template.highValue',
        key: 'template.highValue',
        render: (text, record) => {
          if(text === undefined) {
            return <span>{record.customHighRange}</span>;
          } else {
            return <span>{text}</span>;
          }
        }
      },
      {
        title: 'Gender',
        dataIndex: 'template.gender',
        key: 'template.gender',
      },
      {
        title: 'Age',
        dataIndex: 'template.ageType',
        key: 'template.ageType',
      },
      {
        title: 'Product',
        dataIndex: 'template.product.productType',
        key: 'template.product.productType',
      },
    ];

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <div>
            {list && list.length > 0 &&
              (
                <Table
                  loading={loading}
                  pagination={false}
                  dataSource={list}
                  size="medium"
                  rowKey={record => record.id}
                  columns={columns}
                  footer={() => this.templateActions(true)}
                />)
            }
            {list && list.length <= 0 &&
              (
                <div>
                  <Alert
                    message={`${requestItem.priceListItem.product.productName} successfully posted. Proceed to complete request.`}
                    type="info"
                    description={this.templateActions(false)}
                    showIcon
                  />
                </div>
              )
            }
            {/* {loading && (
                 <div>
                 <Spin tip="Loading templates..." spinning={loading} ></Spin>
                 </div>
            )} */}
          </div>
        </LocaleProvider>
      </div>
    );
  }
}

RequestItemTemplatesView.propTypes = {
  templateInvestigations: PropTypes.object.isRequired,
};

function mapStateToProps({ templateInvestigations }) {
  return { templateInvestigations };
}

export default connect(mapStateToProps)(Form.create()(RequestItemTemplatesView));
