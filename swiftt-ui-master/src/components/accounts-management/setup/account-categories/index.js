import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import AccountCategoryList from './List';
import AccountCategorySearch from './Search';
import AccountCategoryModal from './Modal';

@connect(({ accountCategories, loading }) => ({
  accountCategories,
  loading: loading.effects['accountCategories/query'],
}))
class AccountCategoriesView extends PureComponent {

  static defaultProps = {
    accountCategories: {},
  };

  static propTypes = {
    accountCategories: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'accountCategories/query', payload: { accountCategory: true, size : 2000 } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'accountCategories/purge' });
  }

  render() {
    const { dispatch, accountCategories } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      accountCategoryModalVisible,
      accountCategoryModalType,
    } = accountCategories;

    const accountCategoryModalProps = {
      item: accountCategoryModalType === 'create' ? {} : currentItem,
      type: accountCategoryModalType,
      visible: accountCategoryModalVisible,
      onOk(data) {
        dispatch({ type: `accountCategories/${accountCategoryModalType}`, payload: Object.assign({}, currentItem, data) });
      },
      onCancel() {
        dispatch({ type: 'accountCategories/hideAccountCategoryModal' });
      },
    };

    const accountCategoryListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'accountCategories/query',
          payload: {
            accountCategory: true,
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(publicId) {
        dispatch({ type: 'accountCategories/delete', payload: publicId });
      },
      onEditItem(item) {
        dispatch({
          type: 'accountCategories/showAccountCategoryModal',
          payload: {
            accountCategoryModalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const accountCategorySearchProps = {
      onSearch(fieldsValue) {
        const payload = {
          accountCategory: true
        };

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; } else if (fieldsValue.field === 'accountNumber') { payload.accountNumber = fieldsValue.keyword; }
        }

        dispatch({ type: 'accountCategories/query', payload });
      },
      onAdd() {
        dispatch({
          type: 'accountCategories/showAccountCategoryModal',
          payload: {
            accountCategoryModalType: 'create',
          },
        });
      },
    };

    const AccountCategoryModalGen = () => <AccountCategoryModal {...accountCategoryModalProps} />;

    return (
      <div >
        <Row>
          <Col xs={24} md={24} lg={24}>
            <AccountCategorySearch {...accountCategorySearchProps} />
            <AccountCategoryList {...accountCategoryListProps} />
            <AccountCategoryModalGen />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AccountCategoriesView;
