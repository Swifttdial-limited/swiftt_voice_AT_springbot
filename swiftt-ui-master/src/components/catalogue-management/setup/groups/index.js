import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import GroupList from './List';
import GroupSearch from './Search';
import GroupModal from './Modal';

@connect(({ catalogue_groups, loading }) => ({
  catalogue_groups,
  loading: loading.effects['catalogue_groups/query'],
}))
class GroupsView extends PureComponent {

  static propTypes = {
    catalogue_groups: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    activeFilter: ''
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_groups/query' });
  }

  changeFilterHandler = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'catalogue_groups/query', payload: { parentGroup } });
  }

  render() {
    const { dispatch, catalogue_groups } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = catalogue_groups;

    const groupModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `catalogue_groups/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'catalogue_groups/hideModal' });
      },
    };

    const groupListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'catalogue_groups/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'catalogue_groups/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'catalogue_groups/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const groupSearchProps = {
      onSearch(fieldsValue) {
        let payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'catalogue_groups/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'catalogue_groups/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const GroupModalGen = () => <GroupModal {...groupModalProps} />;

    return (
      <div className="content-inner">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <GroupSearch {...groupSearchProps} />
            <GroupList {...groupListProps} />
            <GroupModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default GroupsView;
