import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

@connect(({ dischargeSummaries, loading }) => ({
  dischargeSummaries,
  loading: loading.effects['dischargeSummaries/query']
}))
class DischargeSummaryView extends PureComponent {

  static propTypes = {
    dischargeSummaries: PropTypes.object,
    encounter: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  state = {};

  componentDidMount() {
    const { dispatch, encounter } = this.props;
    dispatch({ type: 'dischargeSummaries/query', payload: { encounterId: encounter.id } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'dischargeSummaries/purge' });
  }

  render() {
    const { dischargeSummaries } = this.props;
    const { list, loading } = dischargeSummaries;

    return(
      <div>
        { loading && <Card loading /> }
        { !loading && list.length > 0 && (
          <div>
              <div style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: list[0].narrative }} />
            </div>
        )}
      </div>
    );
  }

}

export default DischargeSummaryView;
