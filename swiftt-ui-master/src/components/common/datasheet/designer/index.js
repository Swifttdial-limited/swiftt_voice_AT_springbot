import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Button,
} from 'antd';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

import '../index.less';

class DatasheetDesigner extends PureComponent {

  static defaultProps = {
    content: '',
    onContentChange: () => {},
  };

  static propTypes = {
    content: PropTypes.string,
    onContentChange: PropTypes.func,
  };

  state = {};

  constructor(props) {
    super(props);
    this.handsontableData = Handsontable.helper.createSpreadsheetData(10, 5);
  }

  // TODO: componentWillReceiveProps use loadData to loadData from saved template

  onChangeHandler = (tableData) => {
    const { onContentChange } = this.props;
    onContentChange(JSON.stringify(tableData));
  }

  render() {
    return (
      <HotTable
        data={this.handsontableData}
        colHeaders={true}
        rowHeaders={true}
        contextMenu={true}
        comments={true}
        manualColumnFreeze={true}
        manualColumnMove={true}
        observeChanges={true}
        afterChangesObserved={() => this.onChangeHandler(this.handsontableData)}
        mergeCells={true}
        height="300"
        stretchH="all" />
    );
  }
}

export default DatasheetDesigner;
