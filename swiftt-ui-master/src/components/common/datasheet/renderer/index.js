import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Button,
} from 'antd';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

import '../index.less';

let handsontableData = Handsontable.helper.createSpreadsheetData(1, 1);

function DatasheetRenderer({
  rawContent,
  onContentChange,
}) {

  if(rawContent.length > 1) {
    handsontableData = JSON.parse(rawContent);
  }

  function onChangeHandler(tableData) {
    onContentChange(JSON.stringify(tableData), $("#content").html());
  }

  return (
    <div id="content">
      <HotTable
        data={handsontableData}
        colHeaders={true}
        rowHeaders={true}
        contextMenu={true}
        comments={true}
        manualColumnFreeze={true}
        manualColumnMove={true}
        observeChanges={true}
        afterChangesObserved={() => onChangeHandler(handsontableData)}
        mergeCells={true}
        height="300"
        width="100%"
        stretchH="all" />
    </div>
  );
}

export default DatasheetRenderer;


// class DatasheetRenderer extends PureComponent {
//
//   static defaultProps = {
//     rawContent: '',
//     onContentChange: () => {},
//   };
//
//   static propTypes = {
//     rawContent: PropTypes.string,
//     onContentChange: PropTypes.func,
//   };
//
//   // constructor(props) {
//   //   super(props);
//   //   this.handsontableData = Handsontable.helper.createSpreadsheetData(1, 1);
//   // }
//
//   // TODO: componentWillReceiveProps use loadData to loadData from saved template
//   componentWillReceiveProps(nextProps) {
//     console.log(nextProps)
//     if(nextProps.rawContent && this.props.rawContent === null) {
//       console.log(nextProps.rawContent)
//       this.handsontableData = JSON.parse(nextProps.rawContent)
//     }
//   }
//
//   onChangeHandler = (tableData) => {
//     const { onContentChange } = this.props;
//     onContentChange(JSON.stringify(tableData), $("#content").html());
//   }
//
//   render() {
//     return (
//       <div id="content">
//         {/*
//           <HotTable
//             data={this.handsontableData}
//             colHeaders={true}
//             rowHeaders={true}
//             contextMenu={true}
//             comments={true}
//             manualColumnFreeze={true}
//             manualColumnMove={true}
//             observeChanges={true}
//             afterChangesObserved={() => this.onChangeHandler(this.handsontableData)}
//             mergeCells={true}
//             height="300"
//             width="100%"
//             stretchH="all" />
//         */}
//
//       </div>
//     );
//   }
// }
//
// export default DatasheetRenderer;
