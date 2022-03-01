import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import ContactIdentificationsList from './List';
import ContactIdentificationModal from './Modal';
import ContactIdentificationToolbar from './Toolbar';

@connect(({ contactIdentifications, loading }) => ({
  contactIdentifications,
  loading: loading.effects['contactIdentifications/query']
}))
class ContactIdentificationsView extends PureComponent {

  static defaultProps = {
    contactProfile: {},
    contactIdentifications: {},
  };

  static propTypes = {
    contactProfile: PropTypes.object.isRequired,
    contactIdentifications: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch, contactProfile } = this.props;
    dispatch({ type: 'contactIdentifications/query', payload: { contactId: contactProfile.publicId } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'contactIdentifications/purge' });
  }

  render() {
    const { dispatch, contactIdentifications, contactProfile } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType } = contactIdentifications;

    const contactIdentificationModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      contactProfile,
      onOk(values) {
        values.contactId = contactProfile.publicId;

        dispatch({ type: `contactIdentifications/${modalType}`, payload: values });
      },
      onCancel() {
        dispatch({ type: 'contactIdentifications/hideModal' });
      },
    };

    const contactIdentificationListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {},
      onDeleteItem(id) {
        dispatch({ type: 'contactIdentifications/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'contactIdentifications/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const contactIdentificationToolbarProps = {
      onAdd() {
        dispatch({
          type: 'contactIdentifications/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ContactIdentificationModalGen = () => <ContactIdentificationModal {...contactIdentificationModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <ContactIdentificationToolbar {...contactIdentificationToolbarProps} />
          <ContactIdentificationsList {...contactIdentificationListProps} />
          <ContactIdentificationModalGen />
        </Col>
      </Row>
    );
  }
}

export default ContactIdentificationsView;
