import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UserList from '../../../components/system-administration/users/List';
import UserSearch from '../../../components/system-administration/users/Search';
import UserModal from '../../../components/system-administration/users/Modal';
import UsersImportModal from '../../../components/system-administration/users/ImportModal';

@connect(({ users, loading }) => ({
  users,
  loading: loading.effects['users/query']
}))
class UsersView extends PureComponent {

  static propTypes = {
    users: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'users/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'users/purge' });
  }

  render() {
    const { dispatch, users } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType, importModalVisible } = users;

    const userModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `users/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'users/hideModal' });
      },
    };

    const usersImportModalProps = {
      visible: importModalVisible,
      onCancel() {
        dispatch({ type: 'users/hideImportModal' });
      },
    };

    const userListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'users/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'users/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'users/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const userSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'username') {
            payload.username = fieldsValue.keyword;
          } else if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'users/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'users/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
      onImport() {
        dispatch({
          type: 'users/showImportModal',
        });
      },
    };

    const UserModalGen = () => <UserModal {...userModalProps} />;
    const UsersImportModalGen = () => <UsersImportModal {...usersImportModalProps} />;

    return (
      <PageHeaderLayout
        title="System Users"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col xs={24} md={24} lg={24}>
              <UserSearch {...userSearchProps} />
              <UserList {...userListProps} />
              <UserModalGen />
              <UsersImportModalGen />
            </Col>
          </Row>

        </div>
      </PageHeaderLayout>
    );
  }
}

export default UsersView;
