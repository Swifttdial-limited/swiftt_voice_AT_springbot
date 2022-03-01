import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { DatePicker } from 'antd';
import styles from './index.less';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';


class JournalDetail extends PureComponent {
  render() {
    return (
      <div className="content-inner">
       Hello
      </div>
    );
  }
}

export default JournalDetail;
