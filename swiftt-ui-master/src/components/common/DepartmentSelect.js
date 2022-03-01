import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import { find, map } from 'lodash';
import { Select, Spin } from 'antd';

import { query } from '../../services/departments';

const Option = Select.Option;

class DepartmentSelect extends PureComponent {
  static defaultProps = {
    isBillingAllowed: false,
    multiSelect: false,
    style: {
      minWidth: '200px',
    },
  };

  static propTypes = {
    style: PropTypes.object,
    editValue: PropTypes.object,
    department: PropTypes.string,
    isBillingAllowed: PropTypes.bool,
    parentDepartment: PropTypes.string,
    multiSelect: PropTypes.bool.isRequired,
    onDepartmentSelect: PropTypes.func.isRequired,
  };

  state = {
    departments: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.departmentSearchHandler = debounce(this.departmentSearchHandler, 1000);
  }

  componentDidMount() {
    this.fetchDepartments();
  }

  departmentSearchHandler = (value) => {
    if (value.length > 2) {
      this.fetchDepartments(value);
    }
  }

  fetchDepartments = (searchQueryParam) => {
    const { department, isBillingAllowed, parentDepartment } = this.props;

    this.setState({ loading: true });

    query({
      ...(isBillingAllowed && { isBillingDepartment: true }),
      ...(parentDepartment != undefined && { parentDepartment: parentDepartment }),
      ...(searchQueryParam != undefined && { departmentName: searchQueryParam }),
      size: 1000,
    }).then((response) => {
      this.setState({ departments: response.content, loading: false });
    }).catch((e) => {
      this.setState({ departments: [], loading: false });
    });;
  }

  handleDepartmentSelectChange = (value, e) => {
    const { multiSelect, onDepartmentSelect } = this.props;

    if (!multiSelect) {
      onDepartmentSelect(this.mapSelectedValueToDepartment(value));
    } else {
      onDepartmentSelect(this.mapSelectedValuesToDepartment(value));
    }
  }

  mapSelectedValueToDepartment = (selectedDepartment) => {
    const { departments } = this.state;
    return find(departments, { publicId: selectedDepartment.key});
  }

  mapSelectedValuesToDepartment = (values) => {
    const { departments } = this.state;

    const selectedDepartments = [];
    values.forEach((selectedDepartment) => {
      selectedDepartments.push({ name: selectedDepartment.label, publicId: selectedDepartment.key });
    })

    return selectedDepartments;
  }

  render() {
    const { editValue, multiSelect, style } = this.props;
    const { departments, loading } = this.state;

    const generateLabel = (department) =>
      Object.assign({}, { key: department.publicId, label: department.name });

    const generateDepartmentTokens = (accs) => map(accs, (department) => {
      return generateLabel(department);
    });

    let selectProps = {};

    if(editValue != undefined) {
      if(multiSelect) selectProps.defaultValue = generateDepartmentTokens(editValue);
      else selectProps.defaultValue = generateLabel(editValue);
    }

    return (
      <Select
        {...selectProps}
        allowClear
        labelInValue={true}
        showSearch
        placeholder={multiSelect ? 'Select department(s)' : 'Select department'}
        mode={multiSelect ? 'multiple' : ''}
        notFoundContent={loading ? <Spin size="small" /> : 'No department matching search criteria found'}
        onChange={this.handleDepartmentSelectChange}
        onSearch={this.departmentSearchHandler}
        filterOption={false}>
        {departments.map((department, index) => <Option key={index} value={department.publicId}>{generateLabel(department).label}</Option>)}
      </Select>
    );
  }
}

export default DepartmentSelect;
