import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash.debounce';
import { Row, Col, Select, Spin } from 'antd';

const Option = Select.Option;

class Toolbar extends PureComponent {
  constructor(props) {
    super(props);
    this.userSearchHandler = debounce(this.userSearchHandler, 1000);
  }

  userSearchHandler = (value) => {
    const { dispatch } = this.props;
    if (value.length > 2) {
      const payload = { userName: value };
      dispatch({ type: 'users/query', payload });
    }
  }

 userSelectHandler = (value) => {
   const { dispatch } = this.props;
   dispatch({ type: 'user/query', payload: { publicId: value } });
 }

 render() {
   const { defaultValue, users } = this.props;
   const { list, loading } = users;

   return (
     <Row gutter={24}>
       <Col lg={12} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
         <Select
           allowClear
           defaultValue={defaultValue}
           notFoundContent={loading ? <Spin size="small" /> : 'No user matching search criteria found'}
           placeholder="Search user"
           showSearch
           style={{ width: 300 }}
           onChange={this.userSelectHandler}
           onSearch={this.userSearchHandler}
           filterOption={false}
         >
           {list.map((user, index) => <Option key={index} value={user.publicId}>{user.username} ({user.fullName})</Option>)}
         </Select>
       </Col>
     </Row>
   );
 }
}

Toolbar.propTypes = {
  users: PropTypes.object,
  defaultValue: PropTypes.string.isRequired,
};

function mapStateToProps({ users }) {
  return { users };
}

export default connect(mapStateToProps)(Toolbar);
