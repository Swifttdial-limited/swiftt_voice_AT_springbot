import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Avatar, Button, Modal, Upload, message, Row } from 'antd';
import Ajax from 'robe-ajax';

import { API_URL, api } from '../../utils/config';

let headers = {};
let imageUrl = '';
let bytes = '';

class ImageViewer extends PureComponent {

  static defaultProps = {
    readOnly: true,
  };

  static propTypes = {
    readOnly: PropTypes.bool,
    reference: PropTypes.string,
    referenceType: PropTypes.string,
  };

  state = {
    hasPhoto: false,
    previewVisible: false,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    headers = {
      Authorization: `Bearer ${sessionStorage.getItem('o_t')}`,
    };
  }

  componentWillReceiveProps(nextProps) {
    if('referenceType' in nextProps) {
      this.fetchPhoto(nextProps.referenceType, nextProps.reference);
    }
  }

  fetchPhoto = (referenceType, reference) => {
    let url = '';

    if(reference === undefined && (referenceType === 'INSTITUTION_LOGO' || referenceType === 'USER_PHOTO')) {
      url = `${API_URL + api.files}/me?referenceType=${referenceType}`;
    } else if (referenceType === 'USER_PHOTO') {
      url = `${API_URL + api.files}/${reference}`;
    }

    Ajax.ajax({
      headers,
      url: url,
      method: 'get',
    }).then((response) => {
      this.setState({ hasPhoto: response.length > 0 ? true : false }, () => {
        var profImg = document.getElementById('h11');
        profImg.src = "data:image/png;base64," + [response];
      });
    }).fail((error) => {
      console.log('error', error);
    });
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({ previewVisible: true, });
  }

  handleChange = (info) => {
    const { reference, referenceType } = this.props;

    const status = info.file.status;

    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      this.fetchPhoto(referenceType, reference);
    } else if (status === 'error') {
      message.error(`${info.file.name} photo upload failed.`);
    }
  }

  render() {
    const { fillWrapper, readOnly, reference, referenceType } = this.props;

    const { hasPhoto, previewVisible } = this.state;

    const uploadProps = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      accept: '.png',
      headers,
      action: API_URL + api.files,
      data: {
        referenceId: reference,
        referenceType: 'USER_PHOTO',
      },
      onChange: (info) => this.handleChange(info),
    };

    let avatarIcon = '';
    if( referenceType === 'INSTITUTION_LOGO') {
      avatarIcon = 'bank';
    } else if (referenceType === 'USER_PHOTO') {
      avatarIcon = "user";
    } else {
      avatarIcon = "picture";
    }

    return (
      <div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img id="modalImage" alt="profile" style={{ width: '100%' }} />
        </Modal>
        <Row>
          { hasPhoto
            ? <img
                id="h11"
                onClick={this.handlePreview}
                style={{
                  width: fillWrapper ? '100%' : 125,
                  height: fillWrapper ? '100%' : 125,
                  marginBottom: 10
                }}
                />
            : <Avatar
              style={{
                width: fillWrapper ? '100%' : 125,
                height: fillWrapper ? '100%' : 125,
                lineHeight: fillWrapper ? '200px' : '125px',
                fontSize: 50,
                marginBottom: 10
              }}
              shape="square" icon={avatarIcon} /> }
        </Row>
        { !readOnly && referenceType !== undefined && (
          <Row>
            <Upload {...uploadProps}>
              <Button type="dashed" icon="upload">Change Image</Button>
            </Upload>
          </Row>
        )}
      </div>
    );
  }

}

export default ImageViewer;
