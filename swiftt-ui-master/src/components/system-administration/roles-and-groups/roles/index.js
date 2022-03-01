import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Card } from 'antd';

import RoleList from './List';
import RoleSearch from './Search';
import RoleModal from './Modal';

class RolesView extends PureComponent {
  
  componentDidMount() {
    this.props.dispatch({ type: 'roles/query' });
  }

  render() {
    const { roles, dispatch } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = roles;

    const groupModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `roles/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'roles/hideModal' });
      },
    };

    const groupListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'roles/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'roles/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'roles/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
      onGoToPermissionView(publicId) {
        dispatch(routerRedux.push({
          pathname: `/system-administration/role/view/${publicId}`,
        }));
      },
    };

    const groupSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'roles/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'roles/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const RoleModalGen = () => <RoleModal {...groupModalProps} />;

    return (
      <Card title="Roles and Permissions">
        <RoleSearch {...groupSearchProps} />
        <RoleList {...groupListProps} />
        <RoleModalGen />
      </Card>
    );
  }
}

RolesView.propTypes = {
  roles: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ roles }) {
  return { roles };
}

export default connect(mapStateToProps)(RolesView);
