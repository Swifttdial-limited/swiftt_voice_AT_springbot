import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import BiometricsList from './List';
import BiometricModal from './Modal';
import BiometricToolbar from './Toolbar';
import AlertMessage from '../../../../common/AlertMessage';
import Signature from '../../../../common/Signature';

class BiometricsView extends PureComponent {
  componentDidMount() {
    const { dispatch, userProfile } = this.props;
    dispatch({ type: 'biometrics/query', payload: { userPublicId: userProfile.publicId } });
  }

  componentWillUnmount() {}

  render() {
    const { location, dispatch, biometrics, userProfile } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType, success } = biometrics;

    const biometricModalProps = {
      item: modalType === 'create' ? {} : currentItem,
      type: modalType,
      visible: modalVisible,
      onOk(values) {
        const data = {
          userPublicId: userProfile.publicId,
          ...values,
        };
        dispatch({ type: `biometrics/${modalType}`, payload: data });
      },
      onCancel() {
        dispatch({ type: 'biometrics/hideModal' });
      },
    };

    const biometricListProps = {
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
        dispatch({ type: 'biometrics/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'biometrics/showModal',
          payload: {
            modalType: 'verify',
            currentItem: item,
          },
        });
      },
    };

    const biometricToolbarProps = {
      onAdd() {
        dispatch({
          type: 'biometrics/showModal',
          payload: {
            modalType: 'create',
          },
        });
      },
      onVerify() {
        dispatch({
          type: 'biometrics/showModal',
          payload: {
            modalType: 'verify',
          },
        });
      },
    };

    const BiometricModalGen = () => <BiometricModal {...biometricModalProps} />;

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          <BiometricToolbar {...biometricToolbarProps} />
          <BiometricsList {...biometricListProps} />
          <BiometricModalGen />
          <Signature />

        </Col>
      </Row>
    );
  }
}

BiometricsView.propTypes = {
  userProfile: PropTypes.object.isRequired,
  biometrics: PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ biometrics }) {
  return { biometrics };
}

export default connect(mapStateToProps)(BiometricsView);
