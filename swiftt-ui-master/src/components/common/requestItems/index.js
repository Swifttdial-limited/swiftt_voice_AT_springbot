import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import Authorized from '../../../utils/Authorized';
import RequestItemsList from './List';
import RequestForm from '../requests/services/Form';
import RequestToolbar from '../requests/services/Toolbar';

@connect(({ requestItems, loading }) => ({
  requestItems,
  loading: loading.effects['requestItems/query'],
}))
class EncounterRequestItemsView extends PureComponent {
  static propTypes = {
    encounter: PropTypes.object,
    requests: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    isComposerVisible: false,
  };

  componentDidMount() {
    const { dispatch, encounter } = this.props;
    dispatch({ type: 'requestItems/queryByEncounter', payload: { encounterId: encounter.id } });
  }

  componentDidUpdate(prevProps) {
    const { dispatch, encounter } = this.props;
    if (encounter.id !== prevProps.encounter.id) {
      dispatch({ type: 'requestItems/queryByEncounter', payload: { encounterId: encounter.id } });
    }
  }


  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'requestItems/purge' });
  }

  flipFlopComposerVisible = () => {
    this.setState({ isComposerVisible: false }, () => {
      this.setState({ isComposerVisible: true });
    });
  }

  toggleComposerVisible = () => {
    this.setState((previousState, nextProps) => {
      return {
        isComposerVisible: !previousState.isComposerVisible,
      };
    });
  }

  render() {
    const { location, dispatch, requestItems, encounter, isPreviousVisit } = this.props;
    const { loading, list, pagination, activeEncounterId } = requestItems;

    const { isComposerVisible } = this.state;

    const requestListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {},
      onDeleteItem(id) {
        dispatch({ type: 'requestItems/delete', payload: id });
      },
    };

    const requestFormProps = {
      encounter,
      onCancel: this.toggleComposerVisible,
      onCancelAndNew: this.flipFlopComposerVisible,
    };

    const requestToolbarProps = {
      onAdd: this.toggleComposerVisible,
      isPreviousVisit,
    };

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          { isComposerVisible && !isPreviousVisit && <Card><RequestForm {...requestFormProps} /></Card> }
          { !isComposerVisible &&
            (
              <div>
                { encounter.status !== 'CLOSED' && (
                  <RequestToolbar {...requestToolbarProps} />
                )}

                <Authorized authority="READ_REQUESTS">
                  <RequestItemsList {...requestListProps} />
                </Authorized>
              </div>
            )
          }
        </Col>
      </Row>
    );
  }
}

export default EncounterRequestItemsView;
