import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import UserSpecializationsList from './List';
import UserSpecializationModal from './Modal';
import UserSpecializationToolbar from './Toolbar';

import {
  createUserSpecialization,
  queryUserSpecializations
} from '../../../../../services/users';

@connect()
class UserSpecializationsView extends PureComponent {
  static propTypes = {
    userProfile: PropTypes.string.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    currentItem: {},
    loading: false,
    modalType: 'create',
    modalVisible: false,
    userSpecializations: [],
  };

  componentDidMount() {
    this.fetchUserSpecializations();
  }

  createUserSpecializationHandler = (data) => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/addSpecialization', payload: data });

    setTimeout(() => {
      this.hideModal();
      this.fetchUserSpecializations();
    }, 1500);
  }

  fetchUserSpecializations = () => {
    this.setState({ loading: true });

    queryUserSpecializations({
      userPublicId: this.props.userProfile,
    }).then((response) => {
      this.setState({ loading: false, userSpecializations: response.content });
    }).catch((error) => {
      this.setState({ loading: false, userSpecializations: [] });
    });
  }

  hideModal = () => {
    this.setState({ modalVisible: false });
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  }

  onDeleteItemHandler = (publicId) => {
    const { dispatch, userProfile } = this.props;
    dispatch({
      type: 'user/removeSpecialization',
      payload: {
        userPublicId: userProfile,
        publicId: publicId
      }
    });
  }

  onEditItemHandler = (specification) => {
    this.setState({ currentItem: specification, modalType: 'update' }, () => {
      this.showModal();
    });
  }

  onOkHandler = (formPayload) => {
    const { userProfile } = this.props;
    const { currentItem, modalType } = this.state;

    formPayload.userPublicId = userProfile;

    if(modalType === 'create') {
      this.createUserSpecializationHandler(formPayload);
    } else if(modalType === 'update') {
      this.updateUserSpecializationHandler(Object.assign({}, currentItem, formPayload));
    }
  }

  updateUserSpecializationHandler = (data) => {
    const { dispatch } = this.props;
    const { currentItem } = this.state;

    dispatch({ type: 'user/updateSpecialization', payload: data });

    setTimeout(() => {
      this.hideModal();
      this.fetchUserSpecializations();
    }, 1500);
  }

  render() {
    const { userProfile } = this.props;
    const {
      currentItem,
      loading,
      modalType,
      modalVisible,
      userSpecializations,
    } = this.state;

    const userSpecializationModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      userProfile,
      onOk: this.onOkHandler,
      onCancel: this.hideModal,
    };

    const userSpecializationListProps = {
      dataSource: userSpecializations,
      loading,
      onDeleteItem: this.onDeleteItemHandler,
      onEditItem: this.onEditItemHandler,
    };

    const userSpecializationToolbarProps = {
      onAdd: this.showModal,
    };

    const UserSpecializationModalGen = () => <UserSpecializationModal {...userSpecializationModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <UserSpecializationToolbar {...userSpecializationToolbarProps} />
          <UserSpecializationsList {...userSpecializationListProps} />
          <UserSpecializationModalGen />
        </Col>
      </Row>
    );
  }
}

export default UserSpecializationsView;
