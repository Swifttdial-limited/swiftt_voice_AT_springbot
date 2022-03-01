import React from 'react';
import { Spin, Icon } from 'antd';

function CustomLoader({
  title = '',
  description = '',
}) {

  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

  return (
    <div style={{
      textAlign: 'center',
      borderRadius: 4,
      marginBottom: 20,
      padding: '30px 50px',
      margin: '20px 0px',
    }}>
      <Spin indicator={antIcon} />
    </div>
  );
}

export default CustomLoader;
