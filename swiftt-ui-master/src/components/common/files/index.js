import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Ajax from 'robe-ajax';
import fileDownload from 'react-file-download';
import moment from 'moment';
import { Upload, Icon, message, Card, notification } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import { API_URL, api } from '../../../utils/config';
import FilesList from './List';
import PatientVisitHistory from '../../common/encounters/patientEncounters';

import styles from './index.less';

const Dragger = Upload.Dragger;
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

let headers = {};

@connect(({ files, loading }) => ({
  files,
  loading: loading.effects['files/query']
}))
class FilesView extends PureComponent {

  static defaultProps = {
    disabled: false,
    readOnly: true,
  };

  static propTypes = {
    context: PropTypes.string,
    contextType: PropTypes.string,
    disabled: PropTypes.bool,
    files: PropTypes.object,
    folder: PropTypes.object,
    readOnly: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    headers = {
      Authorization: `Bearer ${sessionStorage.getItem('o_t')}`,
    };
  }

  componentDidMount() {
    this.loadFiles();
  }

  // TODO hint: Using loadFiles creates a one step delay when folder prop is changed. React tingsss!
  componentWillReceiveProps(nextProps) {
    if('folder' in nextProps) {
      if(nextProps.folder.id !== this.props.folder.id) {
        this.props.dispatch({
          type: 'files/query',
          payload: {
            ...(nextProps.folder !== undefined && { folder: nextProps.folder.id })
          }
        });
      }
    }
  }

  loadFiles = (folder) => {
    const {
      context,
      contextType,
      disabled,
      dispatch,
    } = this.props;

    if(contextType !== undefined || context !== undefined || folder !== undefined) {
      dispatch({
        type: 'files/query',
        payload: {
          ...(contextType !== undefined && { referenceType: contextType }),
          ...(context !== undefined && { referenceId: context }),
          ...(folder !== undefined && { folder: folder.id })
        }
      });
    }
  }

  deleteFile = (fileMetadata) => {
    const { context, contextType, dispatch } = this.props;

    dispatch({
      type: 'files/delete',
      payload: {
        id: fileMetadata.id,
        referenceType: contextType,
        referenceId: context
      }
    });
  }

  base64ToArrayBuffer = (base64) => {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  downloadFile = (fileMetadata) => {
    Ajax.ajax({
      headers,
      url: `${API_URL + api.files}/${fileMetadata.id}`,
      method: 'get',
    }).then((response) => {

      var blob = new Blob([this.base64ToArrayBuffer(response)], { type: fileMetadata.contentType }),
          url = window.URL.createObjectURL(blob);

      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";

      a.href = url;
      a.download = fileMetadata.originalFilename;
      a.click();
      window.URL.revokeObjectURL(url);
    }).fail((error) => {
      console.log(error)
    });
  }

  render() {
    const {
      context,
      contextType,
      disabled,
      dispatch,
      files,
      readOnly,
      folder
    } = this.props;
    const {
      list,
      loading,
      pagination
    } = files;

    const props = {
      name: 'file',
      disabled: disabled,
      multiple: true,
      showUploadList: true,
      accept: '.jpg, .png, .pdf, .doc, .docx, .txt, .csv',
      headers,
      action: API_URL + api.files,
      data: {
        ...(folder !== undefined && { folder: folder.id }),
        ...(context !== undefined && { referenceId: context }),
        ...(contextType !== undefined && { referenceType: contextType }),
      },
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
          this.loadFiles();
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    const fileListProps = {
      dataSource: list,
      loading,
      pagination,
      readOnly,
      onPageChange(page) {},
      onDownloadFile(fileMetadata) {
        this.downloadFile(fileMetadata)
      },
      onDeleteFile(fileMetadata) {
        this.deleteFile(fileMetadata);
      },
    };

    return (
      <div>
        {!readOnly && (
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </Dragger>
        )}
        <FilesList {...fileListProps} />
      </div>
    );
  }
}

export default FilesView;
