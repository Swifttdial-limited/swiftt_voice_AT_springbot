import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';

import { Row, Col, Select, Spin } from 'antd';

const Option = Select.Option;

class Toolbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selectDefaultValue: '' };
    this.roleSearchHandler = debounce(this.roleSearchHandler, 1000);
  }

  roleSearchHandler = (value) => {
    const { dispatch } = this.props;
    if (value.length > 2) {
      const payload = { roleName: value };
      dispatch({ type: 'roles/query', payload });
    }
  }

 roleSelectHandler = (value) => {
   const { dispatch } = this.props;
   dispatch({ type: 'role/query', payload: { publicId: value } });
 }

 render() {
   const { defaultValue, roles } = this.props;
   const { list, loading } = roles;

   const { selectDefaultValue } = this.state;

   return (
     <Row gutter={24}>
       <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
         <Select
           allowClear
           defaultValue={defaultValue}
           notFoundContent={loading ? <Spin size="small" /> : 'No role matching search criteria found'}
           placeholder="Search role"
           showSearch
           style={{ width: 300 }}
           onChange={this.roleSelectHandler}
           onSearch={this.roleSearchHandler}
           filterOption={false}
         >
           {list.map((role, index) => <Option key={index} value={role.publicId}>{role.name}</Option>)}
         </Select>
       </Col>
     </Row>
   );
 }
}

Toolbar.propTypes = {
  roles: PropTypes.object,
  defaultValue: PropTypes.string.isRequired,
};

function mapStateToProps({ roles }) {
  return { roles };
}

export default connect(mapStateToProps)(Toolbar);
