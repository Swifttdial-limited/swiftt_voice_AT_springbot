import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Form, Button, Row, Col, Icon, Checkbox } from 'antd';
import includes from 'lodash/includes';

import Authorized from '../../../../utils/Authorized';
import SearchAccount from '../../../ui/search';

const CheckboxGroup = Checkbox.Group;
const options = [
  { label: 'Control Account', value: 'isControlAccount' },
  { label: 'Visible', value: 'isVisible' },
];

class Search extends PureComponent {
  state = {
    isControlAccount: false,
    isVisible: false,
  }

  onAdditionalFilterChange = (checkedValues) => {
    this.resetState();

    if (includes(checkedValues, 'isControlAccount')) { this.setState({ isControlAccount: true }); }

    if (includes(checkedValues, 'isVisible')) { this.setState({ isVisible: true }); }
  }

  resetState = () => {
    this.setState({
      isControlAccount: false,
      isVisible: false,
    });
  }

  render() {
    const {
      field,
      keyword,
      onSearch,
      onAdd,
    } = this.props;

    const searchAccountProps = {
      field,
      keyword,
      size: 'large',
      select: true,
      selectOptions: [{ value: 'accountNumber', name: 'Number' }, { value: 'name', name: 'Name' }],
      selectProps: {
        defaultValue: field || 'accountNumber',
      },
      onSearch: (value) => {
        onSearch(Object.assign({}, value, this.state));
      },
    };

    return (
      <Row gutter={24}>
        <Col lg={9} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
          <SearchAccount {...searchAccountProps} />
        </Col>
        <Col lg={9} md={12} sm={8} xs={24} style={{ marginBottom: 16 }}>
          <CheckboxGroup style={{ lineHeight: 2.5 }} options={options} onChange={this.onAdditionalFilterChange} />
        </Col>
        <Col lg={6} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
          <Authorized authority="CREATE_ACCOUNT">
            <Button type="primary" icon="plus" onClick={onAdd}>New Account</Button>
          </Authorized>
        </Col>
      </Row>
    );
  }
}

Search.defaultProps = {
  onSearch: () => {},
  onAdd: () => {},
  field: '',
  keyword: '',
};

Search.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

export default Form.create()(Search);
