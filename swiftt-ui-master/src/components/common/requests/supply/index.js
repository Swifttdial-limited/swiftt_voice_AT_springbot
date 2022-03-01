import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card, Collapse, Row, Col, Modal } from 'antd';

import Authorized from '../../../../utils/Authorized';
import MedicalSupplyList from './List';
import MedicalSupplyForm from './Form';
import MedicalSupplyToolbar from './Toolbar';

const confirm = Modal.confirm;
const Panel = Collapse.Panel;

@connect(({ medicalSupplies, loading }) => ({
  medicalSupplies,
  loading: loading.effects['medicalSupplies/query'],
}))
class MedicalSupplyView extends PureComponent {

  static propTypes = {
    encounter: PropTypes.object.isRequired,
    medicalSupplies: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    isComposerVisible: false,
  };

  componentDidMount() {
    const { dispatch, encounter } = this.props;
    dispatch({ type: 'medicalSupplies/query', payload: { encounterId: encounter.id } });
  }

  componentDidUpdate(prevProps) {
    const { dispatch, encounter } = this.props;
    if (encounter.id !== prevProps.encounter.id) {
      dispatch({ type: 'medicalSupplies/query', payload: { encounterId: encounter.id } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'medicalSupplies/purge' });
  }

  handleSubmit = (data) => {
    const { dispatch, encounter } = this.props;
    dispatch({ type: 'medicalSupplies/create', payload: { ...data, encounterId: encounter.id } });
    this.toggleComposerVisible('');
  }

  toggleComposerVisible = () => {
    this.setState({ isComposerVisible: !this.state.isComposerVisible });
  }

  render() {
    const { dispatch, encounter, medicalSupplies, isPreviousVisit } = this.props;
    const { loading, list, pagination, currentItem } = medicalSupplies;

    const { isComposerVisible } = this.state;

    const medicalSupplyListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) { },
      onDeleteItem(id) {
        dispatch({ type: 'medicalSupplies/delete', payload: { id, encounterId: encounter.id } });
      },
      onEditItem(item) {
        dispatch({
          type: 'notes/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    const medicalSupplyFormProps = {
      encounter,
      item: currentItem.id ? currentItem : {},
      onCancel: this.toggleComposerVisible,
      onOk: this.handleSubmit,
    };

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          {isComposerVisible && !isPreviousVisit && <MedicalSupplyForm {...medicalSupplyFormProps} />}

          {!isComposerVisible &&
            (
              <div>
                <MedicalSupplyToolbar
                  isPreviousVisit={isPreviousVisit}
                  onAdd={this.toggleComposerVisible}
                />
                <Authorized authority="READ_VISIT_MEDICAL_SUPPLIES">
                  <MedicalSupplyList {...medicalSupplyListProps} />
                </Authorized>
              </div>
            )
          }
        </Col>
      </Row>
    );
  }
}

export default MedicalSupplyView;
