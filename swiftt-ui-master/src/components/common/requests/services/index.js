import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import Authorized from '../../../../utils/Authorized';
import RequestsList from './List';
import RequestForm from './Form';
import RequestToolbar from './Toolbar';

@connect(({ requests, loading }) => ({
  requests,
  loading: loading.effects['requests/query'],
}))
class EncounterRequestsView extends PureComponent {

  static propTypes = {
    encounter: PropTypes.object.isRequired,
    requests: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    isComposerVisible: false,
  };

  componentDidMount() {
    const { dispatch, encounter } = this.props;
    dispatch({ type: 'requests/queryByEncounter', payload: { encounterId: encounter.id } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'requests/purge' });
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
    const { dispatch, requests, encounter } = this.props;
    const { loading, list, pagination, currentItem, modalVisible, modalType } = requests;

    const { isComposerVisible } = this.state;

    const requestListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {},
      onDeleteItem(id) {
        dispatch({ type: 'requests/delete', payload: id });
      },
    };

    const requestFormProps = {
      encounter,
      onCancel: this.toggleComposerVisible,
      onCancelAndNew: this.flipFlopComposerVisible,
    };

    const requestToolbarProps = {
      onAdd: this.toggleComposerVisible,
    };

    return (
      <Row>
        <Col xs={24} md={24} lg={24}>
          { isComposerVisible && <Card><RequestForm {...requestFormProps} /></Card> }
          { !isComposerVisible &&
            (
              <div>
                { encounter.status !== 'CLOSED' && (
                  <RequestToolbar {...requestToolbarProps} />
                )}

                <Authorized authority="READ_REQUESTS">
                  <RequestsList {...requestListProps} />
                </Authorized>
              </div>
            )
          }
        </Col>
      </Row>
    );
  }
}

export default EncounterRequestsView;
