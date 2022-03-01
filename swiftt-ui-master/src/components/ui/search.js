import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Input, Select, Button, Icon } from 'antd';

import styles from './search.less';

class Search extends PureComponent {
    state = {
      clearVisible: false,
      selectValue: (this.props.select && this.props.selectProps) ? this.props.selectProps.defaultValue : '',
    }

    handeleSelectChange = (value) => {
      this.setState({
        ...this.state,
        selectValue: value,
      });
    }


    handleClearInput = () => {
      ReactDOM.findDOMNode(this.refs.searchInput).value = '';
      this.setState({
        clearVisible: false,
      });
      this.handleSearch();
    }
    handleInputChange = (e) => {
      this.setState({
        ...this.state,
        clearVisible: e.target.value !== '',
      });
    }
    handleSearch = (value) => {
      const data = {
        keyword: value,
      };
      if (this.props.select) {
        data.field = this.state.selectValue;
      }
      this.props.onSearch && this.props.onSearch(data);
    }

    render() {
      const { size, select, selectOptions, selectProps, style, keyword } = this.props;
      const { clearVisible } = this.state;
      return (
        <Input.Search
          addonBefore={select && (
          <Select
            ref="searchSelect"
            onChange={this.handeleSelectChange}
            {...selectProps}
          >
            {selectOptions && selectOptions.map((item, key) => (
              <Select.Option
                value={item.value}
                key={key}
              >{item.name || item.value}
              </Select.Option>
))}
          </Select>
)}
          ref="searchInput"
          onChange={this.handleInputChange}
          onSearch={this.handleSearch}
          defaultValue={keyword}
          placeholder="Search.."
        />
      );
    }
}

export default Search;
