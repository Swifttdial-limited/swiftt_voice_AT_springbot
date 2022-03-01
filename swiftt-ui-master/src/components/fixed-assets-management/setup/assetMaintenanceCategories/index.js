import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import GroupList from './List';
import GroupSearch from './Search';
import GroupModal from './Modal';

@connect(({ fixed_asset_maintenance_categories, loading }) => ({ //fixed_asset_maintenance_categories
  fixed_asset_maintenance_categories,
  loading: loading.effects['fixed_asset_maintenance_categories/query'],
}))

class GroupsView extends PureComponent {

  static propTypes = {
    fixed_asset_maintenance_categories: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    activeFilter: ''
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed_asset_maintenance_categories/query' });
  }

  changeFilterHandler = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'fixed_asset_maintenance_categories/query', payload: { parentGroup } });
  }

  render() {
    const { dispatch, fixed_asset_maintenance_categories } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = fixed_asset_maintenance_categories;

    const groupModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `fixed_asset_maintenance_categories/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'fixed_asset_maintenance_categories/hideModal' });
      },
    };

    const groupListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'fixed_asset_maintenance_categories/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'fixed_asset_maintenance_categories/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'fixed_asset_maintenance_categories/showModal',
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
          type: 'fixed_asset_maintenance_categories/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'fixed_asset_maintenance_categories/showModal',
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
