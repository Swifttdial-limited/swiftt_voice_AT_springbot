import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ContactsList from '../../../components/accounts-management/contacts/List';
import ContactsSearch from '../../../components/accounts-management/contacts/Search';
import ContactsImportModal from '../../../components/accounts-management/contacts/ImportModal';

@connect(({ contacts, loading }) => ({
  contacts,
  loading: loading.effects['contacts/query'],
}))
class ContactsManagementView extends PureComponent {
  
  static propTypes = {
    contacts: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;

    dispatch({ type: 'contacts/purge' });
    if (location.pathname === '/accounts/contacts') { dispatch({ type: 'contacts/query' }); }
  }

  render() {
    const { dispatch, contacts } = this.props;
    const {
      loading,
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      importModalVisible,
    } = contacts;

    const contactSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};
        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.name = fieldsValue.keyword; }
        }

        dispatch({
          type: 'contacts/query',
          payload,
        });
      },
      onAdd() {
        dispatch({
          type: 'contacts/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
      onImport() {
        dispatch({
          type: 'contacts/showImportModal',
        });
      },
    };

    const contactsImportModalProps = {
      visible: importModalVisible,
      onCancel() {
        dispatch({ type: 'contacts/hideImportModal' });
      },
    };

    const contactListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'contacts/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
    };

    const ContactsImportModalGen = () => <ContactsImportModal {...contactsImportModalProps} />;

    return (
      <PageHeaderLayout
        title="Contacts"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <ContactsSearch {...contactSearchProps} />
          <ContactsList {...contactListProps} />
        </div>
        <ContactsImportModalGen />
      </PageHeaderLayout>
    );
  }
}

export default ContactsManagementView;
