import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Button, Card, Icon } from 'antd';
import arrayToTree from 'array-to-tree';

import HierarchyChart from '../../../common/hierarchy/HierarchyChart';
import OrganogramNodeModal from './Modal';

import './index.less';

import OrganogramNodeComponent from './OrganogramNodeComponent';

class OrganogramView extends PureComponent {
  static propTypes = {
    dispatch: func.isRequired,
    organogramNodes: object.isRequired,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organogramNodes/query' });
  }

  generateOrganogram = (nodes) => {
    return arrayToTree(nodes, {
      parentProperty: 'parent.id',
      customID: 'id',
    })[0];
  }

  showNodeModal = (e) => {
    this.props.dispatch({
      type: 'organogramNodes/showModal',
      payload: {
        modalType: 'createParentNode',
      },
    });
  }

  render() {
    const { dispatch, organogramNodes } = this.props;
    const {
      list,
      loading,
      currentItem,
      modalVisible,
      modalType,
    } = organogramNodes;

    const organogramNodeModalProps = {
      item: modalType === 'createParentNode' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `organogramNodes/${modalType}`, payload: data });
      },
      onCancel() {
        dispatch({ type: 'organogramNodes/hideModal' });
      },
    };

    const OrganogramModalGen = () => <OrganogramNodeModal {...organogramNodeModalProps} />;

    let treeData = {};

    if (list.length > 0) {
      treeData = this.generateOrganogram(list);
    }

    return (
      <Card title="Organogram">
        {list.length === 0
          ? (
            <Row gutter={24}>
              <Col style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button type="ghost" onClick={this.showNodeModal}><Icon type="plus" />New Node</Button>
              </Col>
            </Row>
) :
            <HierarchyChart data={treeData} nodeComponent={OrganogramNodeComponent} />
        }

        <OrganogramModalGen />
      </Card>
    );
  }
}

function mapStateToProps({ organogramNodes }) {
  return { organogramNodes };
}

export default connect(mapStateToProps)(OrganogramView);
