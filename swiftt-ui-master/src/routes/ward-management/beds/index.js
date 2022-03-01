import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import BedsList from '../../../components/ward-management/beds/List';
import BedModal from '../../../components/ward-management/beds/Modal';
import BedsSearch from '../../../components/ward-management/beds/Search';

@connect(({ beds, loading }) => ({
  beds,
  loading: loading.effects['beds/query'],
}))
class BedsManagementView extends PureComponent {
  
  static propTypes = {
    beds: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'beds/query', payload: { size: 2000 } });
  }

  render() {
    const { beds, dispatch } = this.props;
    const { loading, list, pagination, success, currentItem, modalType, modalVisible } = beds;

    const bedModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(data) {
        dispatch({ type: `beds/${modalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'beds/hideModal' });
      },
    };

    const bedSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};
        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') {
            payload.name = fieldsValue.keyword;
          }
        }

        dispatch({
          type: 'beds/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'beds/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const bedListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'beds/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'beds/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'beds/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const BedModalGen = () => <BedModal {...bedModalProps} />;

    return (
      <PageHeaderLayout
        title="Beds"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col>
              <BedsSearch {...bedSearchProps} />
              <BedsList {...bedListProps} />
              <BedModalGen />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default BedsManagementView;
