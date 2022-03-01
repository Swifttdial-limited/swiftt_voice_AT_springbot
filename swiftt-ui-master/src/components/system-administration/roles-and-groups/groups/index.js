import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Card } from 'antd';

import GroupList from './List';
import GroupSearch from './Search';
import GroupModal from './Modal';

class GroupsView extends PureComponent {
  componentDidMount() {
    this.props.dispatch({ type: 'userGroups/query' });
  }

  render() {
    const { userGroups, dispatch } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = userGroups;

    const groupModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `userGroups/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'userGroups/hideModal' });
      },
    };

    const groupListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'userGroups/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'userGroups/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'userGroups/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const groupSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 2) {
          if (fieldsValue.field === 'name') {
            payload.actorName = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'userGroups/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'userGroups/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const GroupModalGen = () => <GroupModal {...groupModalProps} />;

    return (
      <Card title="User Groups">
        <GroupSearch {...groupSearchProps} />
        <GroupList {...groupListProps} />
        <GroupModalGen />
      </Card>
    );
  }
}

GroupsView.propTypes = {
  userGroups: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ userGroups }) {
  return { userGroups };
}

export default connect(mapStateToProps)(GroupsView);
