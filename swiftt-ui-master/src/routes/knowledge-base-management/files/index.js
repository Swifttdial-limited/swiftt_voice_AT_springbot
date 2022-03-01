import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Row, Col, Card, Icon } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FilesView from '../../../components/common/files';
import FilesSearch from '../../../components/common/files/Search';
import FoldersView from '../../../components/common/files/FoldersView'

class FilesManagementView extends PureComponent {

  state = {
    currentFolder: null,
    showFilesList: false,
  };

  setCurrentFolder = (folder) => {
    this.setState({
      currentFolder: folder,
      showFilesList: true
    });
  }

  render() {
    const {
      currentFolder,
      showFilesList
    } = this.state;

    const fileSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};

        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'searchQueryParam') {
            payload.searchQueryParam = fieldsValue.keyword;
          }
        }
      },
    };

    return (
      <PageHeaderLayout
        title="Document Control"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row gutter={24}>
            <Col span={8}>
              <FoldersView onFolderSelect={this.setCurrentFolder} />
            </Col>
            <Col span={16}>
              { showFilesList
                ? (
                  <div>
                    <FilesSearch {...fileSearchProps} />
                    <br/>
                    <FilesView
                      readOnly={false}
                      folder={currentFolder} />
                  </div>
                )
                : (
                  <Card style={{ marginBottom: 24 }}>
                    <div style={{
                      textAlign: 'center',
                      lineHeight: '200px',
                      fontSize: 16,
                      }}>
                      Select folder to view files
                    </div>
                  </Card>
                )}
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default FilesManagementView;
