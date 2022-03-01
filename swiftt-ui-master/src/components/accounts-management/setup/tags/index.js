import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import TagList from './List';
import TagSearch from './Search';
import TagModal from './Modal';

@connect(({ tags, loading }) => ({
  tags,
  loading: loading.effects['tags/query'],
}))
class TagsView extends PureComponent {

  static propTypes = {
    tags: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tags/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tags/purge' });
  }

  render() {
    const { dispatch, tags } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = tags;

    const tagModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `tags/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'tags/hideModal' });
      },
    };

    const tagListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'tags/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'tags/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'tags/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const tagSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'tags/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'tags/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const TagModalGen = () => <TagModal {...tagModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <TagSearch {...tagSearchProps} />
            <TagList {...tagListProps} />
            <TagModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TagsView;
