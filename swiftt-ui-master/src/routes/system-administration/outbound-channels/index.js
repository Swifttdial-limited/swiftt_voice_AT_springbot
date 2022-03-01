import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import OutboundChannelList from '../../../components/system-administration/outbound-channels/List';
import OutboundChannelSearch from '../../../components/system-administration/outbound-channels/Search';
import OutboundChannelModal from '../../../components/system-administration/outbound-channels/Modal';

@connect(({ outboundChannels, loading }) => ({
  outboundChannels,
  loading: loading.effects['outboundChannels/query']
}))
class OutboundChannelsView extends PureComponent {

  static propTypes = {
    outboundChannels: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'outboundChannels/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'outboundChannels/purge' });
  }

  render() {
    const { dispatch, outboundChannels } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType } = outboundChannels;

    const outboundChannelModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `outboundChannels/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'outboundChannels/hideModal' });
      },
    };

    const outboundChannelListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'outboundChannels/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'outboundChannels/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'outboundChannels/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const outboundChannelSearchProps = {
      onAdd() {
        dispatch({
          type: 'outboundChannels/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const OutboundChannelModalGen = () => <OutboundChannelModal {...outboundChannelModalProps} />;

    return (
      <PageHeaderLayout
        title="Outbound Channels"
        content="Form pages are used to collect or verify information from outboundChannels. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col xs={24} md={24} lg={24}>
              <OutboundChannelSearch {...outboundChannelSearchProps} />
              <OutboundChannelList {...outboundChannelListProps} />
              <OutboundChannelModalGen />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default OutboundChannelsView;
