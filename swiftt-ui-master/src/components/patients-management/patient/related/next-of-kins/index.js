import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import NextOfKinsList from './List';
import NextOfKinModal from './Modal';
import NextOfKinToolbar from './Toolbar';

@connect(({ next_of_kins }) => ({
  next_of_kins
}))
class NextOfKinsView extends PureComponent {

  static propTypes = {
    userProfile: PropTypes.object.isRequired,
    loadData: PropTypes.bool.isRequired,
    next_of_kins: PropTypes.object.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { loadData, dispatch, userProfile } = this.props;

    dispatch({ type: 'next_of_kins/purge' });
    if (loadData) { dispatch({ type: 'next_of_kins/query', payload: { userId: userProfile.publicId } }); }
  }

  render() {
    const { location, dispatch, next_of_kins, userProfile } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType
    } = next_of_kins;

    const nextOfKinModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      userProfile,
      onOk(data) {
        data.userId = userProfile.publicId;
        dispatch({ type: `next_of_kins/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'next_of_kins/hideModal' });
      },
    };

    const nextOfKinListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        const { query, pathname } = location;
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: page.current,
            size: page.pageSize,
          },
        }));
      },
      onDeleteItem(id) {
        dispatch({ type: 'next_of_kins/delete', payload: { userId: userProfile.publicId, publicId: id } });
      },
      onEditItem(item) {
        dispatch({
          type: 'next_of_kins/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const nextOfKinToolbarProps = {
      onAdd() {
        dispatch({
          type: 'next_of_kins/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const NextOfKinModalGen = () => <NextOfKinModal {...nextOfKinModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <NextOfKinToolbar {...nextOfKinToolbarProps} />
          <NextOfKinsList {...nextOfKinListProps} />
          <NextOfKinModalGen />
        </Col>
      </Row>
    );
  }
}

export default NextOfKinsView;
