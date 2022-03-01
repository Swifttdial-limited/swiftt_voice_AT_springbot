import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Row, Col } from 'antd';

import ContactPersonsList from './List';
import ContactPersonModal from './Modal';
import ContactPersonToolbar from './Toolbar';

class ContactPersonsView extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, contactProfile } = this.props;
    dispatch({ type: 'contactPersons/query', payload: { contactId: contactProfile.publicId } });
  }  

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'contactPersons/purge' });
  }

  render() {
    const { dispatch, contactPersons, contactProfile } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType } = contactPersons;

    const contactPersonModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      contactProfile,
      onOk(values) {
        values.contactId = contactProfile.publicId;

        dispatch({ type: `contactPersons/${modalType}`, payload: values });
      },
      onCancel() {
        dispatch({ type: 'contactPersons/hideModal' });
      },
    };

    const contactPersonListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        const { query, pathname } = location;
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: page.current,
            size: page.pageSize,
          },
        }));
      },
      onDeleteItem(id) {
        dispatch({ type: 'contactPersons/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'contactPersons/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const contactPersonToolbarProps = {
      onAdd() {
        dispatch({
          type: 'contactPersons/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
    };

    const ContactPersonModalGen = () => <ContactPersonModal {...contactPersonModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <ContactPersonToolbar {...contactPersonToolbarProps} />
          <ContactPersonsList {...contactPersonListProps} />
          <ContactPersonModalGen />
        </Col>
      </Row>
    );
  }
}

ContactPersonsView.propTypes = {
  contactProfile: PropTypes.object.isRequired,
  contactPersons: PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ contactPersons }) {
  return { contactPersons };
}

export default connect(mapStateToProps)(ContactPersonsView);
