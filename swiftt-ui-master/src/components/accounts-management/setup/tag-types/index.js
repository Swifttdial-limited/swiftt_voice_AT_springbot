import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import TagTypeList from './List';
import TagTypeSearch from './Search';
import TagTypeModal from './Modal';

@connect(({ tagTypes, loading }) => ({
  tagTypes,
  loading: loading.effects['tagTypes/query'],
}))
class TagTypesView extends PureComponent {

  static propTypes = {
    tagTypes: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tagTypes/query' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'tagTypes/purge' });
  }

  render() {
    const { dispatch, tagTypes } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = tagTypes;

    const tagTypeModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `tagTypes/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'tagTypes/hideModal' });
      },
    };

    const tagTypeListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'tagTypes/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'tagTypes/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'tagTypes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const tagTypeSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }
        dispatch({ type: 'tagTypes/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'tagTypes/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const TagTypeModalGen = () => <TagTypeModal {...tagTypeModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <TagTypeSearch {...tagTypeSearchProps} />
            <TagTypeList {...tagTypeListProps} />
            <TagTypeModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TagTypesView;
