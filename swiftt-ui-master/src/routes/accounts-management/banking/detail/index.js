import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva/index';
import { Card } from 'antd';
import styles from './index.less';
import DescriptionList from '../../../../components/DescriptionList';

const { Description } = DescriptionList;

@connect(({ banking, loading }) => ({
  banking,
  loading: loading.effects['banking/query'],
}))
class BankingDetail3 extends PureComponent {

  componentDidMount() {
    const { dispatch, match } = this.props;
    // dispatch({
    //   type: 'banking/fetchBankingEntryLines',
    //   payload: { id: match.params.id },
    // });
  }

  render() {
    const { banking, match } = this.props;
    return (
      <div className="content-inner">
        <Card>
          <DescriptionList title="">
            <Description term="Firefox">
              Firefox
            </Description>
          </DescriptionList>
        </Card>
      </div>
    );
  }
}

export default BankingDetail3;
