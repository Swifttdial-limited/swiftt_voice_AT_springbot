import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card, Collapse, Row, Col, Modal } from 'antd';

import Authorized from '../../../utils/Authorized';
import MedicationList from './List';
import MedicationForm from './Form';
import MedicationToolbar from './Toolbar';

const confirm = Modal.confirm;
const Panel = Collapse.Panel;

@connect(({ medications, loading }) => ({
  medications,
  loading: loading.effects['medications/query'],
}))
class MedicationView extends PureComponent {

  static propTypes = {
    encounter: PropTypes.object.isRequired,
    medications: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    isComposerVisible: false,
    medicationType: '',
  };

  componentDidMount() {
    const { dispatch, encounter } = this.props;
    dispatch({ type: 'medications/query', payload: { encounterId: encounter.id } });
  }

  componentDidUpdate(prevProps) {
    const { dispatch, encounter } = this.props;
    if (encounter.id !== prevProps.encounter.id) {
      dispatch({ type: 'medications/query', payload: { encounterId: encounter.id } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'medications/purge' });
  }

  handleSubmit = (data) => {
    const { dispatch, encounter } = this.props;
    dispatch({ type: 'medications/create', payload: { ...data, encounterId: encounter.id } });
    this.toggleComposerVisible('');
  }

  toggleComposerVisible = (medicationType) => {
    this.setState({ isComposerVisible: !this.state.isComposerVisible, medicationType: medicationType });
  }

  render() {
    const { dispatch, encounter, medications, isPreviousVisit } = this.props;
    const { loading, list, pagination, currentItem } = medications;

    const { isComposerVisible, medicationType } = this.state;

    const medicationListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) { },
      onDeleteItem(id) {
        dispatch({ type: 'medications/delete', payload: { id, encounterId: encounter.id } });
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

    const medicationFormProps = {
      encounter,
      item: currentItem.id ? currentItem : {},
      medicationType: medicationType,
      onCancel: this.toggleComposerVisible,
      onOk: this.handleSubmit,
    };

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          {isComposerVisible && !isPreviousVisit && <MedicationForm {...medicationFormProps} />}

          {!isComposerVisible &&
            (
              <div>
                <MedicationToolbar
                  isPreviousVisit={isPreviousVisit}
                  onAdd={this.toggleComposerVisible}
                />
                <Authorized authority="READ_VISIT_MEDICATIONS">
                  <MedicationList {...medicationListProps} />
                </Authorized>
              </div>
            )
          }
        </Col>
      </Row>
    );
  }
}

export default MedicationView;
