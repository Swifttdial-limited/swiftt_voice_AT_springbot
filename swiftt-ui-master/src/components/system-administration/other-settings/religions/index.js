import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import ReligionList from './List';
import ReligionSearch from './Search';
import ReligionModal from './Modal';

@connect(({ religions, loading }) => ({
  religions,
  loading: loading.effects['religions/query'],
}))
class ReligionsView extends PureComponent {
  static propTypes = {
    religions: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'religions/query' });
  }

  render() {
    const { dispatch, religions } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
    } = religions;

    const religionModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `religions/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'religions/hideModal' });
      },
    };

    const religionListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'religions/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'religions/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'religions/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const religionSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};
        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'religions/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'religions/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ReligionModalGen = () => <ReligionModal {...religionModalProps} />;

    return (
      <Card title="Religions">
        <ReligionSearch {...religionSearchProps} />
        <ReligionList {...religionListProps} />
        <ReligionModalGen />
      </Card>
    );
  }
}

export default ReligionsView;
