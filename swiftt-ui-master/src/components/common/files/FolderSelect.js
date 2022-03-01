import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { queryFolders } from '../../../services/files';

const Option = Select.Option;

class FolderSelect extends PureComponent {

  static defaultProps = {
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    editValue: PropTypes.object,
    multiSelect: PropTypes.bool.isRequired,
    onFolderSelect: PropTypes.func.isRequired,
  };

  state = {
    folders: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.folderSearchHandler = debounce(this.folderSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchFolders();
  }

  folderSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchFolders(value);
    }
  }

  fetchFolders = (searchQueryParam) => {
    const { department } = this.props;

    this.setState({ loading: true });

    queryFolders({
      ...(searchQueryParam != undefined && { name: searchQueryParam })
    }).then((response) => {
      this.setState({ folders: response.content, loading: false });
    }).catch((e) => {
      this.setState({ folders: [], loading: false });
    });;
  }

  handleFolderSelectChange = (value, e) => {
    const { multiSelect, onFolderSelect } = this.props;

    if (!multiSelect) {
      onFolderSelect(this.mapSelectedValueToFolder(value));
    } else {
      onFolderSelect(this.mapSelectedValuesToFolder(value));
    }
  }

  mapSelectedValueToFolder = (selectedFolder) => {
    const { folders } = this.state;
    return find(folders, { id: selectedFolder.key});
  }

  mapSelectedValuesToFolder = (values) => {
    const { folders } = this.state;

    const selectedFolders = [];
    values.forEach((selectedFolder) => {
      selectedFolders.push({ name: selectedFolder.label, id: selectedFolder.key });
    })

    return selectedFolders;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { folders, loading } = this.state;

    const generateLabel = (folder) =>
      Object.assign({}, { key: folder.id, label: folder.folderName });

    const generateFolderTokens = (folders) => map(folders, (folder) => {
      return generateLabel(folder);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateFolderTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        style={{...style}}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select folder(s)' : 'Select folder'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No folder matching search criteria found'}
        onChange={this.handleFolderSelectChange}
        onSearch={this.folderSearchHandler}
        filterOption={false}>
        {folders.map((folder, index) => <Option key={index} value={folder.id}>{generateLabel(folder).label}</Option>)}
      </Select>
    );
  }
}

export default FolderSelect;
