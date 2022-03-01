import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import TitleList from './List';
import TitleSearch from './search';
import TitleModal from './Modal';

@connect(({ titles, loading }) => ({
  titles,
  loading: loading.effects['titles/query'],
}))
class TitlesView extends PureComponent {
  static propTypes = {
    titles: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'titles/query' });
  }

  render() {
    const { dispatch, titles } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = titles;

    const titleModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({
          type: `titles/${modalType}`,
          payload: Object.assign({}, currentItem, data),
        });
      },
      onCancel() {
        dispatch({ type: 'titles/hideModal' });
      },
    };

    const titleListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'titles/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'titles/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'titles/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const titleSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'titles/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'titles/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const TitleModalGen = () => <TitleModal {...titleModalProps} />;

    return (
      <Card title="Titles">
        <TitleSearch {...titleSearchProps} />
        <TitleList {...titleListProps} />
        <TitleModalGen />
      </Card>
    );
  }
}

export default TitlesView;
